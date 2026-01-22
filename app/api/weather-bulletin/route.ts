import { NextRequest, NextResponse } from 'next/server'

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY
const CEREBRAS_MODEL = 'gpt-oss-120b'

export async function POST(request: NextRequest) {
    try {
        const { weatherData, selectedDay, selectedCity } = await request.json()

        if (!weatherData || weatherData.length === 0) {
            return NextResponse.json({ error: 'No weather data provided' }, { status: 400 })
        }

        // Format weather data for the AI
        const today = new Date()
        today.setDate(today.getDate() + selectedDay)
        const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' })
        const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

        // Summarize weather conditions
        const weatherSummary = weatherData.map((data: any, index: number) => {
            if (!data?.daily) return null
            const tempMax = Math.round(data.daily.temperature_2m_max?.[selectedDay] || 0)
            const tempMin = Math.round(data.daily.temperature_2m_min?.[selectedDay] || 0)
            const weatherCode = data.daily.weather_code?.[selectedDay] || 0

            let condition = 'ensoleillé'
            if (weatherCode >= 51 && weatherCode <= 99) condition = 'pluvieux'
            else if (weatherCode >= 1 && weatherCode <= 50) condition = 'nuageux'

            return {
                city: data.cityName || `Ville ${index + 1}`,
                tempMax,
                tempMin,
                condition
            }
        }).filter(Boolean)

        let prompt;
        if (selectedCity) {
            const cityData = weatherSummary.find((d: any) => d.city === selectedCity)
            if (!cityData) throw new Error("City data not found")

            prompt = `Tu es un météorologue de Martinique. Génère un bulletin météo COURT pour la ville de ${selectedCity}.

Date: ${dayName} ${dateStr}

Données pour ${selectedCity}:
- Température: Min ${cityData.tempMin}°C, Max ${cityData.tempMax}°C
- Condition: ${cityData.condition}

Instructions:
1. Maximum 60 mots
2. Utilise **texte** pour mettre en gras la température et la condition.
3. Commence directement par "À ${selectedCity}..."
4. Ton professionnel et chaleureux.
5. Donne un conseil court lié à la météo (plage, parapluie, etc).

Exemple:
"À **${selectedCity}**, le temps sera **${cityData.condition}** avec des températures comprises entre **${cityData.tempMin}°C et ${cityData.tempMax}°C**. C'est une journée idéale pour **une promenade au bord de mer**. Profitez-en !"`
        } else {
            const avgTempMax = Math.round(weatherSummary.reduce((acc: number, d: any) => acc + d.tempMax, 0) / weatherSummary.length)
            const avgTempMin = Math.round(weatherSummary.reduce((acc: number, d: any) => acc + d.tempMin, 0) / weatherSummary.length)
            const rainyCount = weatherSummary.filter((d: any) => d.condition === 'pluvieux').length
            const cloudyCount = weatherSummary.filter((d: any) => d.condition === 'nuageux').length
            const sunnyCount = weatherSummary.filter((d: any) => d.condition === 'ensoleillé').length

            prompt = `Tu es un météorologue de Martinique. Génère un bulletin météo COURT pour toute l'île.

Date: ${dayName} ${dateStr}

Données globales:
- Température moyenne: Min ${avgTempMin}°C, Max ${avgTempMax}°C
- Zones ensoleillées: ${sunnyCount}, nuageuses: ${cloudyCount}, pluvieuses: ${rainyCount}

Instructions:
1. Maximum 80 mots
2. Utilise **texte** pour mettre en gras les infos importantes.
3. Structure: salutation courte → conditions générales → conseils pratiques.
4. Ton professionnel et chaleureux.

Exemple:
"Bonjour Martinique ! **Temps ensoleillé** sur l'ensemble de l'île avec des températures de **28°C à 31°C**. Quelques averses possibles dans le **nord** en fin d'après-midi. **Pensez à vous hydrater** et à protéger votre peau du soleil. Bonne journée !"`
        }

        const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CEREBRAS_API_KEY}`
            },
            body: JSON.stringify({
                model: CEREBRAS_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un météorologue expérimenté basé en Martinique. Tu rédiges des bulletins météo professionnels, informatifs et chaleureux en français. Tu connais bien la géographie de la Martinique et ses microclimats.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Cerebras API error:', errorText)
            return NextResponse.json({ error: 'Failed to generate bulletin' }, { status: 500 })
        }

        const data = await response.json()
        const bulletin = data.choices?.[0]?.message?.content || 'Bulletin météo temporairement indisponible.'

        return NextResponse.json({ bulletin })

    } catch (error) {
        console.error('Error generating weather bulletin:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
