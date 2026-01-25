// Developed by Omar Rafik (OMX) - omx001@proton.me

import { getPaymentConfirmationEmailHtml, getCancellationEmailHtml, getPlanChangeEmailHtml } from '@/lib/email-templates'



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


export async function sendSMS(
  phone: string,
  message: string
): Promise<SendSMSResult> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    console.error('❌ BREVO_API_KEY is not configured')
    return { success: false, error: 'Brevo API key not configured' }
  }


  let formattedPhone = phone.replace(/\s/g, '')


  if (formattedPhone.startsWith('0')) {



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
        'api-key': apiKey,
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


export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<SendEmailResult> {
  const apiKey = process.env.BREVO_API_KEY
  console.log('📧 Attempting to send email to:', to)
  console.log('🔑 API Key configured:', !!apiKey, 'Length:', apiKey?.length)

  if (!apiKey) {
    console.error('❌ BREVO_API_KEY is not configured')
    return { success: false, error: 'Brevo API key not configured' }
  }

  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
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


export function generateReferenceCode(sessionId?: string): string {
  if (sessionId) {
    const hash = sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `MQ${(hash % 900000 + 100000).toString()}`
  }
  const timestamp = Date.now().toString(36).toUpperCase().slice(-4)
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `MQ${timestamp}${random}`
}


function getPriceForPlan(plan: string): string {
  switch (plan) {
    case 'sms-monthly': return '4,99€'
    case 'sms-annual': return '49,90€'
    case 'email-annual': return '10€'
    default: return ''
  }
}


function getPlanDisplayName(plan: string): string {
  switch (plan) {
    case 'sms-monthly': return 'SMS Standard Mensuel'
    case 'sms-annual': return 'SMS Standard Annuel'
    case 'email-annual': return 'Alertes Email Annuel'
    default: return 'Abonnement'
  }
}


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



export async function sendEmailConfirmation(
  email: string,
  plan: string,
  referenceCode: string,
  invoicePdfUrl?: string
): Promise<SendEmailResult> {
  const price = getPriceForPlan(plan)
  const planName = getPlanDisplayName(plan)
  const subject = 'Vous avez mis en place un nouvel abonnement Météo Martinique'

  const htmlContent = getPaymentConfirmationEmailHtml(price, planName, referenceCode, invoicePdfUrl)

  return sendEmail(email, subject, htmlContent)
}



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

export async function sendInvoiceEmail(
  email: string,
  amount: string,
  pdfUrl: string,
  invoiceNumber: string
): Promise<SendEmailResult> {
  const subject = `Facture ${invoiceNumber} - Météo Martinique`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Votre Facture</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #334155; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #0f172a; text-decoration: none; }
        .card { background: #f8fafc; border-radius: 12px; padding: 24px; text-align: center; border: 1px solid #e2e8f0; }
        .amount { font-size: 32px; font-weight: 800; color: #0f172a; margin: 10px 0; }
        .btn { display: inline-block; background: #0f172a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a href="#" class="logo">Météo Martinique</a>
        </div>
        <div class="card">
          <h2>Merci pour votre paiement</h2>
          <p>Voici votre facture pour la période en cours.</p>
          <div class="amount">${amount}</div>
          <p>Facture #${invoiceNumber}</p>
          <a href="${pdfUrl}" class="btn">Télécharger la facture (PDF)</a>
        </div>
        <div class="footer">
          <p>Merci de votre confiance.</p>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail(email, subject, htmlContent)
}