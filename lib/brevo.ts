/**
 * Brevo SMS and Email Service
 * 
 * Handles sending transactional SMS and Email via Brevo API
 * Docs: https://developers.brevo.com/
 */
import { getPaymentConfirmationEmailHtml, getCancellationEmailHtml, getPlanChangeEmailHtml } from '@/lib/email-templates'

const BREVO_API_KEY = process.env.BREVO_API_KEY
const BREVO_SMS_SENDER = process.env.BREVO_SMS_SENDER || 'MeteoMQ'
const BREVO_EMAIL_SENDER = process.env.BREVO_EMAIL_SENDER || 'bossjack1kalirafik@gmail.com'
const BREVO_EMAIL_SENDER_NAME = process.env.BREVO_EMAIL_SENDER_NAME || 'Météo Martinique alertes'

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
  console.log('📧 Attempting to send email to:', to)
  console.log('🔑 API Key configured:', !!BREVO_API_KEY, 'Length:', BREVO_API_KEY?.length)

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
    console.log('📡 Brevo Response Status:', response.status)
    console.log('📦 Brevo Response Data:', JSON.stringify(data, null, 2))

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

  const message = `Météo Martinique: Merci! Votre abonnement ${planName} (${price}) est actif. Reference: ${referenceCode}. Vous recevrez des alertes meteo automatiquement.`

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
  const subject = 'Vous avez mis en place un nouvel abonnement Météo Martinique'

  const htmlContent = getPaymentConfirmationEmailHtml(price, planName, referenceCode)

  return sendEmail(email, subject, htmlContent)
}


/**
 * Send Cancellation Email
 */
export async function sendCancellationEmail(
  email: string,
  plan: string,
  endDate: string
): Promise<SendEmailResult> {
  const planName = getPlanDisplayName(plan)
  const subject = 'Confirmation de l\'annulation de votre abonnement Météo Martinique'

  const htmlContent = getCancellationEmailHtml(planName, endDate)

  return sendEmail(email, subject, htmlContent)
}

/**
 * Send Plan Change Email
 */
export async function sendPlanChangeEmail(
  email: string,
  newPlan: string
): Promise<SendEmailResult> {
  const planName = getPlanDisplayName(newPlan)
  const price = getPriceForPlan(newPlan)
  const subject = 'Confirmation de changement d\'abonnement Météo Martinique'

  const htmlContent = getPlanChangeEmailHtml(planName, price)

  return sendEmail(email, subject, htmlContent)
}
