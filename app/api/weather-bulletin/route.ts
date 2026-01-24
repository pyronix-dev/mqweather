// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextRequest, NextResponse } from 'next/server'

const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY
const CEREBRAS_MODEL = 'gpt-oss-120b'

export async function POST(request: NextRequest) {
    try {
        const { weatherData, selectedDay, selectedCity, timeOfDay } = await request.json()

        if (!weatherData || weatherData.length === 0) {
            return NextResponse.json({ error: 'No weather data provided' }, { status: 400 })
        }

        
        const today = new Date()
        today.setDate(today.getDate() + selectedDay)
        const dayName = today.toLocaleDateString('fr-FR', { weekday: 'long' })
        const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

        
        const timeLabel = timeOfDay === 'morning' ? 'Matin' : 'Après-midi'

        
        
        const hourOffset = timeOfDay === 'morning' ? 8 : 14
        const targetHourIndex = (selectedDay * 24) + hourOffset

        
        const weatherSummary = weatherData.map((data: any, index: number) => {
            if (!data?.hourly?.weather_code || !data?.hourly?.temperature_2m) return null

            
            const currentTemp = Math.round(data.hourly.temperature_2m[targetHourIndex] || 0)
            const weatherCode = data.hourly.weather_code[targetHourIndex] || 0

            
            const dailyMax = Math.round(data.daily?.temperature_2m_max?.[selectedDay] || 0)
            const dailyMin = Math.round(data.daily?.temperature_2m_min?.[selectedDay] || 0)

            let condition = 'ensoleillé'
            if (weatherCode >= 51 && weatherCode <= 99) condition = 'pluvieux'
            else if (weatherCode === 3 || weatherCode === 45 || weatherCode === 48) condition = 'nuageux'
            else if (weatherCode === 2) condition = 'partiellement nuageux'
            else if (weatherCode === 0 || weatherCode === 1) condition = 'ensoleillé'
            else if (weatherCode >= 4 && weatherCode <= 50) condition = 'mitigé'

            return {
                city: data.cityName || `Ville ${index + 1}`,
                temp: currentTemp,
                tempMax: dailyMax,
                tempMin: dailyMin,
                condition
            }
        }).filter(Boolean)

        let prompt;

        if (selectedCity) {
            const cityData = weatherSummary.find((d: any) => d.city === selectedCity)
            if (!cityData) throw new Error("City data not found")

            let timeInstruction = "6. Utilise le futur pour les prévisions (ex: 'le ciel sera')."
            let exampleText = `"${dayName} ${dateStr} (${timeLabel}) : À **${selectedCity}**, ce ${timeLabel.toLowerCase()}, le temps sera **${cityData.condition}** avec une température de **${cityData.temp}°C**. C'est un moment idéal pour **une promenade**. Profitez-en !"`

            if (selectedDay === 0) {
                timeInstruction = "6. IMPORTANT : Nous sommes aujourd'hui. Utilise le PRÉSENT (ex: 'le ciel est')."
                exampleText = `"${dayName} ${dateStr} (${timeLabel}) : Aujourd'hui en ce ${timeLabel.toLowerCase()} à **${selectedCity}**, le temps est **${cityData.condition}** avec **${cityData.temp}°C**. Profitez de ce moment pour **sortir** !"`
            }

            prompt = `Tu es un météorologue de Martinique. Génère un bulletin météo COURT pour la ville de ${selectedCity} pour ce **${timeLabel}**.
            
Date: ${dayName} ${dateStr} - Période: ${timeLabel}

Données pour ${selectedCity} (${timeLabel}):
- Température prévue: ${cityData.temp}°C
- Condition: ${cityData.condition}

Instructions:
1. Commence IMPÉRATIVEMENT par la date au format "${dayName} ${dateStr} :" suivi de ton message.
2. Précise bien que c'est la météo du **${timeLabel}**.
3. Maximum 60 mots après la date.
4. Utilise **texte** pour mettre en gras la température et la condition.
5. Ton professionnel et chaleureux.
${timeInstruction}
6. Donne un conseil court adapté à cette météo précise.

Exemple:
${exampleText}`;
        } else {
            const avgTemp = Math.round(weatherSummary.reduce((acc: number, d: any) => acc + d.temp, 0) / weatherSummary.length)
            const rainyCount = weatherSummary.filter((d: any) => d.condition === 'pluvieux').length
            const cloudyCount = weatherSummary.filter((d: any) => d.condition === 'nuageux').length
            const sunnyCount = weatherSummary.filter((d: any) => d.condition === 'ensoleillé').length
            const mainCondition = sunnyCount > weatherSummary.length / 2 ? 'ensoleillé' : rainyCount > weatherSummary.length / 3 ? 'pluvieux' : 'variable'

            let timeInstruction = "6. Utilise le futur pour les prévisions."
            let exampleText = `"${dayName} ${dateStr} : Bonjour Martinique ! Ce ${timeLabel.toLowerCase()}, **temps ${mainCondition}** sur l'ensemble de l'île with **${avgTemp}°C**..."`

            if (selectedDay === 0) {
                timeInstruction = "6. IMPORTANT : Nous sommes aujourd'hui. Utilise le PRÉSENT."
                exampleText = `"${dayName} ${dateStr} : Bonjour Martinique ! En ce ${timeLabel.toLowerCase()}, le temps est **${mainCondition}** sur l'ensemble de l'île avec **${avgTemp}°C**..."`
            }

            prompt = `Tu es un météorologue de Martinique. Génère un bulletin météo COURT pour toute l'île pour ce **${timeLabel}**.

Date: ${dayName} ${dateStr} - Période: ${timeLabel}

Données globales (${timeLabel}):
- Température moyenne: ${avgTemp}°C
- Zones ensoleillées: ${sunnyCount}, nuageuses: ${cloudyCount}, pluvieuses: ${rainyCount}
- Tendance générale: ${mainCondition}

Instructions:
1. Commence IMPÉRATIVEMENT par la date au format "${dayName} ${dateStr} :" suivi de ton message.
2. Mentionne explicitement "Ce matin" ou "Cet après-midi".
3. Maximum 80 mots après la date.
4. Utilise **texte** pour mettre en gras les infos importantes.
5. Structure: salutation courte → conditions du moment → conseils.
${timeInstruction}

Exemple:
${exampleText}`;
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