// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'


export async function GET() {
    const admin = await requireAdmin()
    if (admin instanceof NextResponse) return admin

    const supabase = createSupabaseAdmin()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    
    const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

    
    const { count: newUsersToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

    
    const { count: newUsersThisMonth } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thisMonth)

    
    const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active')

    
    const { count: totalObservations } = await supabase
        .from('observations')
        .select('*', { count: 'exact', head: true })

    
    const { count: observationsToday } = await supabase
        .from('observations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)

    
    const { count: bannedUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_banned', true)

    
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: recentUsers } = await supabase
        .from('users')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo)

    
    const signupsByDay: Record<string, number> = {}
    recentUsers?.forEach(user => {
        const date = new Date(user.created_at).toISOString().split('T')[0]
        signupsByDay[date] = (signupsByDay[date] || 0) + 1
    })

    
    const { data: recentLogins } = await supabase
        .from('login_history')
        .select('created_at, location_city')
        .gte('created_at', thirtyDaysAgo)

    const loginsByDay: Record<string, number> = {}
    const cityStats: Record<string, number> = {}

    recentLogins?.forEach(log => {
        
        const date = new Date(log.created_at).toISOString().split('T')[0]
        loginsByDay[date] = (loginsByDay[date] || 0) + 1

        
        if (log.location_city && log.location_city !== 'Inconnue') {
            cityStats[log.location_city] = (cityStats[log.location_city] || 0) + 1
        }
    })

    
    const chartData = []
    const todayDate = new Date()
    for (let i = 29; i >= 0; i--) {
        const d = new Date()
        d.setDate(todayDate.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        chartData.push({
            date: dateStr,
            users: signupsByDay[dateStr] || 0,
            active: loginsByDay[dateStr] || 0
        })
    }

    
    const topCities = Object.entries(cityStats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }))

    return NextResponse.json({
        totalUsers: totalUsers || 0,
        newUsersToday: newUsersToday || 0,
        newUsersThisMonth: newUsersThisMonth || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalObservations: totalObservations || 0,
        observationsToday: observationsToday || 0,
        bannedUsers: bannedUsers || 0,
        chartData,
        topCities
    })
}