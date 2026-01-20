import { NextResponse } from 'next/server';
import { fetchAndParseVigilanceData } from '@/app/api/vigilance/route';
import { createClient } from '@supabase/supabase-js';
import { sendEmail } from '@/lib/brevo';
import { getVigilanceAlertEmailHtml } from '@/lib/email-templates';

// Initialize Supabase Admin client (to access all users)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
    try {
        console.log('[Cron] Checking vigilance status...');

        // 1. Fetch current vigilance data
        const currentData = await fetchAndParseVigilanceData();

        if (!currentData || currentData.colorName === 'erreur') {
            return NextResponse.json({ message: 'Error fetching vigilance data', data: currentData }, { status: 500 });
        }

        const currentColorId = currentData.colorId;
        const currentColorName = currentData.colorName;

        // 2. Fetch last known state from DB
        const { data: lastState, error: dbError } = await supabase
            .from('vigilance_state')
            .select('*')
            .limit(1)
            .maybeSingle();

        if (dbError) {
            console.error('[Cron] DB Error:', dbError);
            return NextResponse.json({ message: 'Database error', error: dbError }, { status: 500 });
        }

        // Initialize if empty
        if (!lastState) {
            console.log('[Cron] No previous state found. Initializing...');
            await supabase.from('vigilance_state').insert({
                color_id: currentColorId,
                color_name: currentColorName,
                updated_at: new Date().toISOString()
            });
            return NextResponse.json({ message: 'State initialized', color: currentColorName });
        }

        const lastColorId = lastState.color_id;

        // 3. Compare
        if (currentColorId !== lastColorId) {
            console.log(`[Cron] Vigilance changed from ${lastState.color_name} (${lastColorId}) to ${currentColorName} (${currentColorId})`);

            // Update DB immediately
            await supabase
                .from('vigilance_state')
                .update({
                    color_id: currentColorId,
                    color_name: currentColorName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', lastState.id); // Assuming single row or update all? Better update by ID.

            // 4. Check if we should send emails
            // Condition: New color is NOT Green (1) and NOT Error (-1)
            if (currentColorId > 1) {
                console.log('[Cron] Triggering alert emails...');

                // Fetch active subscribers
                // Assuming we want to send to ALL users who have 'active' subscription?
                // Or just all users? "send all the users that subscribed"
                // We'll join users and subscriptions.
                const { data: users, error: usersError } = await supabase
                    .from('users')
                    .select('email, id, subscriptions(status)')
                    .eq('subscriptions.status', 'active');

                // Note: The above query assumes 1:1 or 1:many. If multiple subscriptions, might duplicate?
                // Better: Get distinct users with at least one active subscription.
                // Or just get all users and filter.

                if (usersError) {
                    console.error('[Cron] Error fetching users:', usersError);
                } else if (users && users.length > 0) {
                    console.log(`[Cron] Found ${users.length} subscribed users.`);

                    const emailHtml = getVigilanceAlertEmailHtml(currentColorName);
                    const subject = `⚠️ Alerte Météo: Vigilance ${currentColorName.charAt(0).toUpperCase() + currentColorName.slice(1)}`;

                    let sentCount = 0;
                    for (const user of users) {
                        try {
                            if (user.email) {
                                await sendEmail(user.email, subject, emailHtml);
                                sentCount++;
                            }
                        } catch (emailErr) {
                            console.error(`[Cron] Failed to send to ${user.email}`, emailErr);
                        }
                    }
                    console.log(`[Cron] Sent ${sentCount} emails.`);
                    return NextResponse.json({ message: 'Alerts sent', count: sentCount, newColor: currentColorName });
                } else {
                    console.log('[Cron] No subscribed users found.');
                    return NextResponse.json({ message: 'No subscribers', newColor: currentColorName });
                }
            } else {
                console.log('[Cron] New color is Green or Grey. No emails sent.');
                return NextResponse.json({ message: 'Status updated (Green/Grey)', newColor: currentColorName });
            }
        } else {
            console.log('[Cron] No change in vigilance.');
            return NextResponse.json({ message: 'No change', color: currentColorName });
        }

        return NextResponse.json({ message: 'Check complete' });

    } catch (error) {
        console.error('[Cron] Unhandled error:', error);
        return NextResponse.json({ message: 'Internal Server Error', error: String(error) }, { status: 500 });
    }
}
