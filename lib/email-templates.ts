
/**
 * HTML Email Templates
 */

// Logo URLs
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

export function getPaymentConfirmationEmailHtml(price: string, planName: string, referenceCode: string): string {
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
