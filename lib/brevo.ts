/**
 * Brevo SMS and Email Service
 * 
 * Handles sending transactional SMS and Email via Brevo API
 * Docs: https://developers.brevo.com/
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_SMS_SENDER = process.env.BREVO_SMS_SENDER || 'MQWeather'
const BREVO_EMAIL_SENDER = process.env.BREVO_EMAIL_SENDER || 'alertes@mqweather.fr'
const BREVO_EMAIL_SENDER_NAME = process.env.BREVO_EMAIL_SENDER_NAME || 'MQ Weather Alertes'

const BREVO_API_URL = 'https://api.brevo.com/v3'

interface SendSMSResult {
  success: boolean
  messageId?: string
  error?: string
}

interface SendEmailResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send SMS via Brevo Transactional SMS API
 */
export async function sendSMS(
  phone: string,
  message: string
): Promise<SendSMSResult> {
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not configured')
    return { success: false, error: 'Brevo API key not configured' }
  }

  // Format phone number
  let formattedPhone = phone.replace(/\s/g, '') // Remove spaces

  // Handle Martinique/France local format
  if (formattedPhone.startsWith('0')) {
    // Assume non-international number is +596 (Martinique) or +33 depends on context
    // Given this is a Martinique app (MQ Weather), default to +596 for 0696/0697, else maybe +33? 
    // For safety, let's treat 0696/0697 as +596, otherwise +33 (France Hexagone)
    if (formattedPhone.startsWith('0696') || formattedPhone.startsWith('0697')) {
      formattedPhone = '+596' + formattedPhone.substring(1)
    } else {
      formattedPhone = '+33' + formattedPhone.substring(1)
    }
  } else if (!formattedPhone.startsWith('+')) {
    formattedPhone = '+' + formattedPhone
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/transactionalSMS/sms`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        type: 'transactional',
        unicodeEnabled: true,
        sender: BREVO_SMS_SENDER,
        recipient: formattedPhone,
        content: message,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ SMS sent successfully:', data.messageId)
      return { success: true, messageId: data.messageId }
    } else {
      console.error('❌ SMS sending failed:', data)
      return { success: false, error: data.message || 'SMS sending failed' }
    }
  } catch (error) {
    console.error('❌ SMS sending error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Send Email via Brevo Transactional Email API
 */
export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<SendEmailResult> {
  if (!BREVO_API_KEY) {
    console.error('❌ BREVO_API_KEY is not configured')
    return { success: false, error: 'Brevo API key not configured' }
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: BREVO_EMAIL_SENDER_NAME,
          email: BREVO_EMAIL_SENDER,
        },
        to: [{ email: to }],
        subject,
        htmlContent,
        textContent: textContent || htmlContent.replace(/<[^>]*>/g, ''),
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Email sent successfully:', data.messageId)
      return { success: true, messageId: data.messageId }
    } else {
      console.error('❌ Email sending failed:', data)
      return { success: false, error: data.message || 'Email sending failed' }
    }
  } catch (error) {
    console.error('❌ Email sending error:', error)
    return { success: false, error: String(error) }
  }
}

/**
 * Generate a reference code for a subscription
 */
export function generateReferenceCode(sessionId?: string): string {
  if (sessionId) {
    const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `MQ${(hash % 900000 + 100000).toString()}`
  }
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MQ${timestamp}${random}`
}

/**
 * Get price string for plan
 */
function getPriceForPlan(plan: string): string {
  switch (plan) {
    case 'sms-monthly': return '4,99€'
    case 'sms-annual': return '49,90€'
    case 'email-annual': return '10€'
    default: return ''
  }
}

/**
 * Get plan display name
 */
function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'sms-monthly': return 'SMS Standard Mensuel'
    case 'sms-annual': return 'SMS Standard Annuel'
    case 'email-annual': return 'Alertes Email Annuel'
    default: return 'Abonnement'
  }
}

/**
 * Send SMS confirmation after successful payment
 */
export async function sendSMSConfirmation(
  phone: string,
  plan: string,
  referenceCode: string
): Promise<SendSMSResult> {
  const price = getPriceForPlan(plan)
  const planName = getPlanDisplayName(plan)

  const message = `MQ Weather: Merci! Votre abonnement ${planName} (${price}) est actif. Reference: ${referenceCode}. Vous recevrez des alertes meteo automatiquement.`

  return sendSMS(phone, message)
}

/**
 * Send Email confirmation after successful payment
 */
export async function sendEmailConfirmation(
  email: string,
  plan: string,
  referenceCode: string
): Promise<SendEmailResult> {
  const price = getPriceForPlan(plan)
  const planName = getPlanDisplayName(plan)
  const subject = 'Vous avez mis en place un nouvel abonnement MQ Weather'

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 30px 40px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <img src="https://mqweather.surge.sh/icon.svg" alt="MQ Weather" width="40" height="40" style="display: block;">
                  </td>
                  <td style="text-align: right;">
                    <span style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Confirmation de paiement</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 10px 0; font-size: 24px; color: #1e293b; font-weight: 600;">Bonjour,</h1>
              <p style="margin: 0 0 30px 0; font-size: 16px; color: #475569; line-height: 1.6;">
                Votre prélèvement automatique a été configuré avec succès.
              </p>
              
              <!-- Reference Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                      Votre numéro de référence est: <span style="color: #059669;">${referenceCode}</span>
                    </p>
                    
                    <!-- Checkmark Item 1 -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 12px;">
                      <tr>
                        <td width="24" valign="top">
                          <span style="color: #10b981; font-size: 16px;">✓</span>
                        </td>
                        <td style="color: #475569; font-size: 14px; line-height: 1.5;">
                          Nous vous informerons avant que le premier paiement de <strong style="color: #1e293b;">${price}</strong> ne soit effectué
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Checkmark Item 2 -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="24" valign="top">
                          <span style="color: #10b981; font-size: 16px;">✓</span>
                        </td>
                        <td style="color: #475569; font-size: 14px; line-height: 1.5;">
                          Abonnement: <strong style="color: #1e293b;">${planName}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- What's Next Section -->
              <h2 style="margin: 30px 0 15px 0; font-size: 18px; color: #1e293b; font-weight: 600;">
                Que se passe-t-il ensuite ?
              </h2>
              <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">
                Vous recevrez automatiquement des alertes météo détaillées en cas de vigilance sur la Martinique. Conservez votre numéro de référence pour gérer votre abonnement.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="text-align: center;">
                    <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: 600; color: #1e293b;">MQ Weather</p>
                    <p style="margin: 0; font-size: 12px; color: #64748b;">
                      Alertes Météo Martinique<br>
                      <a href="https://mqweather.surge.sh" style="color: #059669; text-decoration: none;">mqweather.surge.sh</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  return sendEmail(email, subject, htmlContent)
}

