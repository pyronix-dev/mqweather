import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local
const envPath = resolve(process.cwd(), '.env.local');
config({ path: envPath });

import { sendEmail } from '../lib/brevo';
import { getVigilanceAlertEmailHtml } from '../lib/email-templates';

async function main() {
    const targetEmail = 'rzotime@gmail.com';
    console.log(`Sending Test RED ALERT (No Animation, With Logo) to: ${targetEmail}`);

    const html = getVigilanceAlertEmailHtml('rouge');

    try {
        const result = await sendEmail(
            targetEmail,
            '⚠️ [TEST] Vigilance Rouge: Logo Updated',
            html
        );
        console.log('✅ Email Sent Successfully!', result);
    } catch (error) {
        console.error('❌ Failed to send email:', error);
    }
}

main();
