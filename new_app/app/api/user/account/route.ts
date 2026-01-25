// Developed by Omar Rafik (OMX) - omx001@proton.me
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function DELETE(request: Request) {
    try {
        const cookieStore = await cookies()
        const authSession = cookieStore.get('auth_session')?.value

        if (!authSession) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const session = JSON.parse(authSession)
        const userId = session.userId

        if (!userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
        }

        const supabase = createSupabaseAdmin()

        
        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (fetchError || !user) {
            console.error('Delete User: Failed to fetch user data', fetchError)
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        
        const { error: archiveError } = await supabase
            .from('deleted_users')
            .insert({
                id: user.id,
                reference_code: user.reference_code,
                email: user.email,
                phone: user.phone,
                full_name: user.full_name,
                original_created_at: user.created_at
            })

        if (archiveError) {
            console.error('Delete User: Failed to archive', archiveError)
            return NextResponse.json({ error: 'Failed to archive user' }, { status: 500 })
        }

        
        const { error: deletePublicError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId)

        if (deletePublicError) {
            console.error('Delete User: Failed to delete public profile', deletePublicError)
            return NextResponse.json({ error: 'Failed to delete profile' }, { status: 500 })
        }

        
        const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
            userId
        )

        if (deleteAuthError) {
            console.error('Delete User: Failed to delete auth user', deleteAuthError)
            
            
        }

        
        cookieStore.delete('auth_session')

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Delete account error:', error)
        return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }
}