// Developed by Omar Rafik (OMX) - omx001@proton.me




const LOGO_TEXT_URL = "https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo-text.png"
const LOGO_ICON_URL = "https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo.png"

export function getOtpEmailHtml(code: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f4f7f6;
        margin: 0;
        padding: 0;
        color: #333333;
    }
    .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    .header {
        background-color: #ffffff;
        padding: 30px 40px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
    }
    .logo {
        height: 60px;
        width: auto;
    }
    .content {
        padding: 40px;
        line-height: 1.6;
    }
    .h1 {
        color: #1a202c;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
    }
    .otp-box {
        background-color: #f0fdf4;
        border: 2px solid #bbf7d0;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
    }
    .otp-code {
        font-family: 'Courier New', monospace;
        font-size: 32px;
        font-weight: bold;
        color: #15803d;
        letter-spacing: 5px;
    }
    .footer {
        background-color: #f8fafc;
        padding: 20px 40px;
        text-align: center;
        font-size: 12px;
        color: #94a3b8;
    }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique Logo" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Vérifiez votre adresse email</h1>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit à <strong>Météo Martinique</strong>. Pour finaliser votre inscription et recevoir les alertes météo, veuillez utiliser le code de vérification ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">${code}</div>
            </div>
            
            <p>Ce code est valide pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <br>
            <p>Cordialement,<br>L'équipe Météo Martinique</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`
}

export function getMagicLinkEmailHtml(link: string, code: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .logo { height: 60px; width: auto; }
    .content { padding: 40px; line-height: 1.6; }
    .h1 { color: #1a202c; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .btn-container { text-align: center; margin: 30px 0; }
    .btn { display: inline-block; background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .otp-box { background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; margin: 30px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #334155; letter-spacing: 3px; }
    .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Connexion à votre compte</h1>
            <p>Bonjour,</p>
            <p>Cliquez sur le lien ci-dessous pour vous connecter directement :</p>
            
            <div class="btn-container">
                <a href="${link}" class="btn">Me connecter</a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #64748b;">Ou utilisez ce code de vérification :</p>
            
            <div class="otp-box">
                <div class="otp-code">${code}</div>
            </div>
            
            <p>Ce lien et ce code sont valides pendant 10 minutes.</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
`
}

export function getVerifyEmailHtml(code: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .logo { height: 60px; width: auto; }
    .content { padding: 40px; line-height: 1.6; }
    .h1 { color: #1a202c; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .otp-box { background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #15803d; letter-spacing: 5px; }
    .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Vérifiez votre email</h1>
            <p>Bonjour,</p>
            <p>Pour confirmer votre abonnement aux alertes email, veuillez utiliser le code ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">${code}</div>
            </div>
            
            <p>Ce code est valide pendant 10 minutes.</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`
}

export function getPaymentConfirmationEmailHtml(price: string, planName: string, referenceCode: string, invoicePdfUrl?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .logo { height: 60px; width: auto; }
    .content { padding: 40px; line-height: 1.6; }
    .h1 { color: #1a202c; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .ref-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Confirmation de paiement</h1>
            <p>Bonjour,</p>
            <p>Votre prélèvement automatique a été configuré avec succès.</p>
            
            <div class="ref-box">
                <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                  Votre numéro de référence est: <span style="color: #059669;">${referenceCode}</span>
                </p>
                <p>✓ Abonnement: <strong>${planName}</strong></p>
                <p>✓ Montant: <strong>${price}</strong></p>
            </div>

            ${invoicePdfUrl ? `
            <p style="text-align: center; margin: 30px 0;">
                <a href="${invoicePdfUrl}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    📄 Télécharger la facture
                </a>
            </p>
            ` : ''}
            
            <h3>Que se passe-t-il ensuite ?</h3>
            <p>Vous recevrez automatiquement des alertes météo détaillées en cas de vigilance sur la Martinique.</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`
}

export function getCancellationEmailHtml(planName: string, endDate: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .logo { height: 60px; width: auto; }
    .content { padding: 40px; line-height: 1.6; }
    .h1 { color: #1a202c; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .info-box { background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Confirmation d'annulation</h1>
            <p>Bonjour,</p>
            <p>Nous vous confirmons l'annulation de votre abonnement <strong>${planName}</strong>.</p>
            
            <div class="info-box">
                <p style="margin: 0; color: #881337;">
                  Votre abonnement restera actif jusqu'au : <br>
                  <strong style="font-size: 18px;">${endDate}</strong>
                </p>
            </div>
            
            <p>Vous ne serez plus débité après cette date. Nous espérons vous revoir bientôt !</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`
}


export function getPlanChangeEmailHtml(planName: string, price: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
<style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
    .header { background-color: #ffffff; padding: 30px 40px; text-align: center; border-bottom: 1px solid #f0f0f0; }
    .logo { height: 60px; width: auto; }
    .content { padding: 40px; line-height: 1.6; }
    .h1 { color: #1a202c; font-size: 24px; font-weight: 700; margin-bottom: 20px; text-align: center; }
    .info-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin: 30px 0; }
    .footer { background-color: #f8fafc; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Abonnement mis à jour</h1>
            <p>Bonjour,</p>
            <p>Votre demande de changement d'abonnement a bien été prise en compte.</p>
            
            <div class="info-box">
                <p style="margin: 0; color: #15803d; font-size: 16px;">
                  Votre nouvelle formule : <br>
                  <strong style="font-size: 20px;">${planName}</strong>
                </p>
                <p style="margin-top: 10px; color: #15803d;">Tarif : <strong>${price}</strong></p>
            </div>
            
            <p>Vous profiterez immédiatement des avantages de votre nouvelle formule.</p>
        </div>
        <div class="footer">
            <img src="${LOGO_ICON_URL}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`
}

interface VigilanceTheme {
    color: string;
    bgColor: string;
    borderColor: string;
    title: string;
    message: string;
    animation?: string;
}

const VIGILANCE_THEMES: Record<string, VigilanceTheme> = {
    jaune: {
        color: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fcd34d',
        title: 'Vigilance Jaune',
        message: 'Soyez attentif',
        animation: ''
    },
    orange: {
        color: '#f97316',
        bgColor: '#fff7ed',
        borderColor: '#fdba74',
        title: 'Vigilance Orange',
        message: 'Soyez vigilant',
        animation: ''
    },
    rouge: {
        color: '#dc2626',
        bgColor: '#fef2f2',
        borderColor: '#fca5a5',
        title: 'Vigilance Rouge',
        message: 'Vigilance absolue',
        animation: 'pulse-border'
    },
    violet: {
        color: '#7c3aed',
        bgColor: '#f5f3ff',
        borderColor: '#c4b5fd',
        title: 'Vigilance Violette',
        message: 'Danger extrême',
        animation: 'pulse-border-violet'
    }
}

export function getVigilanceAlertEmailHtml(colorName: string): string {
    const theme = VIGILANCE_THEMES[colorName.toLowerCase()] || VIGILANCE_THEMES.jaune



    const iconUrl = "https://img.icons8.com/ios-filled/100/ffffff/high-priority-message.png"

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alerte Météo Martinique</title>
    <style>
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Brand Header -->
        <div style="background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <img src="${LOGO_TEXT_URL}" alt="Météo Martinique" style="height: 48px; width: auto;">
        </div>

        <!-- Colored Alert Banner -->
        <div style="background-color: ${theme.color}; padding: 40px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${theme.title}
            </h1>
            <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 20px; font-weight: 600;">
                ${theme.message}
            </p>
        </div>

        <!-- Content Body -->
        <div style="padding: 40px 32px; text-align: center;">
            <p style="margin: 0 0 32px 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
                Le niveau de vigilance a changé sur la Martinique.
                <br>
                <span style="color: #6b7280; font-size: 16px;">Veuillez consulter la carte pour les détails.</span>
            </p>

            <a href="https://mqweather.vercel.app/vigilance" class="btn" style="display: inline-block; background-color: ${theme.color}; color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                Voir la carte vigilance
            </a>
            
            <!-- Unsubscribe Link -->
            <p style="margin: 32px 0 0 0; font-size: 13px;">
                <a href="https://mqweather.vercel.app/unsubscribe" style="color: #94a3b8; text-decoration: underline;">Se désinscrire de ces alertes</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
             <img src="${LOGO_ICON_URL}" alt="Icon" width="32" height="24" style="opacity: 0.6; margin-bottom: 12px;">
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">Météo Martinique Alertes</p>
            <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 12px;">© ${new Date().getFullYear()} Météo Martinique. Tous droits réservés.</p>
        </div>
    </div>
</body>
</html>
    `
}