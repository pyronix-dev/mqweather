module.exports=[48650,e=>{"use strict";let o="https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo-text.png",t="https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo.png";function n(e){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique Logo" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">V\xe9rifiez votre adresse email</h1>
            <p>Bonjour,</p>
            <p>Merci de vous \xeatre inscrit \xe0 <strong>M\xe9t\xe9o Martinique</strong>. Pour finaliser votre inscription et recevoir les alertes m\xe9t\xe9o, veuillez utiliser le code de v\xe9rification ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">${e}</div>
            </div>
            
            <p>Ce code est valide pendant 10 minutes. Si vous n'\xeates pas \xe0 l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <br>
            <p>Cordialement,<br>L'\xe9quipe M\xe9t\xe9o Martinique</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`}function r(e,n){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Connexion \xe0 votre compte</h1>
            <p>Bonjour,</p>
            <p>Cliquez sur le lien ci-dessous pour vous connecter directement :</p>
            
            <div class="btn-container">
                <a href="${e}" class="btn">Me connecter</a>
            </div>
            
            <p style="text-align: center; font-size: 14px; color: #64748b;">Ou utilisez ce code de v\xe9rification :</p>
            
            <div class="otp-box">
                <div class="otp-code">${n}</div>
            </div>
            
            <p>Ce lien et ce code sont valides pendant 10 minutes.</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
        </div>
    </div>
</body>
</html>
`}function i(e){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">V\xe9rifiez votre email</h1>
            <p>Bonjour,</p>
            <p>Pour confirmer votre abonnement aux alertes email, veuillez utiliser le code ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">${e}</div>
            </div>
            
            <p>Ce code est valide pendant 10 minutes.</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`}function a(e,n,r,i){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Confirmation de paiement</h1>
            <p>Bonjour,</p>
            <p>Votre pr\xe9l\xe8vement automatique a \xe9t\xe9 configur\xe9 avec succ\xe8s.</p>
            
            <div class="ref-box">
                <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: 700; color: #1e293b;">
                  Votre num\xe9ro de r\xe9f\xe9rence est: <span style="color: #059669;">${r}</span>
                </p>
                <p>✓ Abonnement: <strong>${n}</strong></p>
                <p>✓ Montant: <strong>${e}</strong></p>
            </div>

            ${i?`
            <p style="text-align: center; margin: 30px 0;">
                <a href="${i}" style="background-color: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
                    📄 T\xe9l\xe9charger la facture
                </a>
            </p>
            `:""}
            
            <h3>Que se passe-t-il ensuite ?</h3>
            <p>Vous recevrez automatiquement des alertes m\xe9t\xe9o d\xe9taill\xe9es en cas de vigilance sur la Martinique.</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`}function s(e,n){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Confirmation d'annulation</h1>
            <p>Bonjour,</p>
            <p>Nous vous confirmons l'annulation de votre abonnement <strong>${e}</strong>.</p>
            
            <div class="info-box">
                <p style="margin: 0; color: #881337;">
                  Votre abonnement restera actif jusqu'au : <br>
                  <strong style="font-size: 18px;">${n}</strong>
                </p>
            </div>
            
            <p>Vous ne serez plus d\xe9bit\xe9 apr\xe8s cette date. Nous esp\xe9rons vous revoir bient\xf4t !</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`}function l(e,n){return`
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
            <img src="${o}" alt="M\xe9t\xe9o Martinique" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Abonnement mis \xe0 jour</h1>
            <p>Bonjour,</p>
            <p>Votre demande de changement d'abonnement a bien \xe9t\xe9 prise en compte.</p>
            
            <div class="info-box">
                <p style="margin: 0; color: #15803d; font-size: 16px;">
                  Votre nouvelle formule : <br>
                  <strong style="font-size: 20px;">${e}</strong>
                </p>
                <p style="margin-top: 10px; color: #15803d;">Tarif : <strong>${n}</strong></p>
            </div>
            
            <p>Vous profiterez imm\xe9diatement des avantages de votre nouvelle formule.</p>
        </div>
        <div class="footer">
            <img src="${t}" alt="Icon" width="40" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
`}let d={jaune:{color:"#f59e0b",bgColor:"#fffbeb",borderColor:"#fcd34d",title:"Vigilance Jaune",message:"Soyez attentif",animation:""},orange:{color:"#f97316",bgColor:"#fff7ed",borderColor:"#fdba74",title:"Vigilance Orange",message:"Soyez vigilant",animation:""},rouge:{color:"#dc2626",bgColor:"#fef2f2",borderColor:"#fca5a5",title:"Vigilance Rouge",message:"Vigilance absolue",animation:"pulse-border"},violet:{color:"#7c3aed",bgColor:"#f5f3ff",borderColor:"#c4b5fd",title:"Vigilance Violette",message:"Danger extrême",animation:"pulse-border-violet"}};function c(e){let n=d[e.toLowerCase()]||d.jaune;return`
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alerte M\xe9t\xe9o Martinique</title>
    <style>
        .btn:hover { opacity: 0.9; }
    </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
        
        <!-- Brand Header -->
        <div style="background-color: #ffffff; padding: 24px; text-align: center; border-bottom: 1px solid #f0f0f0;">
            <img src="${o}" alt="M\xe9t\xe9o Martinique" style="height: 48px; width: auto;">
        </div>

        <!-- Colored Alert Banner -->
        <div style="background-color: ${n.color}; padding: 40px 24px; text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${n.title}
            </h1>
            <p style="margin: 12px 0 0 0; color: rgba(255,255,255,0.95); font-size: 20px; font-weight: 600;">
                ${n.message}
            </p>
        </div>

        <!-- Content Body -->
        <div style="padding: 40px 32px; text-align: center;">
            <p style="margin: 0 0 32px 0; color: #1f2937; font-size: 18px; line-height: 1.6;">
                Le niveau de vigilance a chang\xe9 sur la Martinique.
                <br>
                <span style="color: #6b7280; font-size: 16px;">Veuillez consulter la carte pour les d\xe9tails.</span>
            </p>

            <a href="https://mqweather.vercel.app/vigilance" class="btn" style="display: inline-block; background-color: ${n.color}; color: white; padding: 18px 40px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 18px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                Voir la carte vigilance
            </a>
            
            <!-- Unsubscribe Link -->
            <p style="margin: 32px 0 0 0; font-size: 13px;">
                <a href="https://mqweather.vercel.app/unsubscribe" style="color: #94a3b8; text-decoration: underline;">Se d\xe9sinscrire de ces alertes</a>
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
             <img src="${t}" alt="Icon" width="32" height="24" style="opacity: 0.6; margin-bottom: 12px;">
            <p style="margin: 0; color: #94a3b8; font-size: 13px;">M\xe9t\xe9o Martinique Alertes</p>
            <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 12px;">\xa9 ${new Date().getFullYear()} M\xe9t\xe9o Martinique. Tous droits r\xe9serv\xe9s.</p>
        </div>
    </div>
</body>
</html>
    `}e.s(["getCancellationEmailHtml",()=>s,"getMagicLinkEmailHtml",()=>r,"getOtpEmailHtml",()=>n,"getPaymentConfirmationEmailHtml",()=>a,"getPlanChangeEmailHtml",()=>l,"getVerifyEmailHtml",()=>i,"getVigilanceAlertEmailHtml",()=>c])},75741,e=>{"use strict";var o=e.i(48650);let t=process.env.BREVO_SMS_SENDER||"MeteoMQ",n=process.env.BREVO_EMAIL_SENDER||"bossjack1kalirafik@gmail.com",r=process.env.BREVO_EMAIL_SENDER_NAME||"Météo Martinique alertes",i="https://api.brevo.com/v3";async function a(e,o){let n=process.env.BREVO_API_KEY;if(!n)return console.error("❌ BREVO_API_KEY is not configured"),{success:!1,error:"Brevo API key not configured"};let r=e.replace(/\s/g,"");r.startsWith("0")?r=r.startsWith("0696")||r.startsWith("0697")?"+596"+r.substring(1):"+33"+r.substring(1):r.startsWith("+")||(r="+"+r);try{let e=await fetch(`${i}/transactionalSMS/sms`,{method:"POST",headers:{accept:"application/json","api-key":n,"content-type":"application/json"},body:JSON.stringify({type:"transactional",unicodeEnabled:!0,sender:t,recipient:r,content:o})}),a=await e.json();if(e.ok)return console.log("✅ SMS sent successfully:",a.messageId),{success:!0,messageId:a.messageId};return console.error("❌ SMS sending failed:",a),{success:!1,error:a.message||"SMS sending failed"}}catch(e){return console.error("❌ SMS sending error:",e),{success:!1,error:String(e)}}}async function s(e,o,t,a){let s=process.env.BREVO_API_KEY;if(console.log("📧 Attempting to send email to:",e),console.log("🔑 API Key configured:",!!s,"Length:",s?.length),!s)return console.error("❌ BREVO_API_KEY is not configured"),{success:!1,error:"Brevo API key not configured"};try{let l=await fetch(`${i}/smtp/email`,{method:"POST",headers:{accept:"application/json","api-key":s,"content-type":"application/json"},body:JSON.stringify({sender:{name:r,email:n},to:[{email:e}],subject:o,htmlContent:t,textContent:a||t.replace(/<[^>]*>/g,"")})}),d=await l.json();if(console.log("📡 Brevo Response Status:",l.status),console.log("📦 Brevo Response Data:",JSON.stringify(d,null,2)),l.ok)return console.log("✅ Email sent successfully:",d.messageId),{success:!0,messageId:d.messageId};return console.error("❌ Email sending failed:",d),{success:!1,error:d.message||"Email sending failed"}}catch(e){return console.error("❌ Email sending error:",e),{success:!1,error:String(e)}}}function l(e){if(e){let o=e.split("").reduce((e,o)=>e+o.charCodeAt(0),0);return`MQ${(o%9e5+1e5).toString()}`}let o=Date.now().toString(36).toUpperCase().slice(-4),t=Math.random().toString(36).substring(2,6).toUpperCase();return`MQ${o}${t}`}function d(e){switch(e){case"sms-monthly":return"4,99€";case"sms-annual":return"49,90€";case"email-annual":return"10€";default:return""}}function c(e){switch(e){case"sms-monthly":return"SMS Standard Mensuel";case"sms-annual":return"SMS Standard Annuel";case"email-annual":return"Alertes Email Annuel";default:return"Abonnement"}}async function p(e,o,t){let n=d(o),r=c(o);return a(e,`M\xe9t\xe9o Martinique: Merci! Votre abonnement ${r} (${n}) est actif. Reference: ${t}. Vous recevrez des alertes meteo automatiquement.`)}async function f(e,t,n,r){let i=d(t),a=c(t);return s(e,"Vous avez mis en place un nouvel abonnement Météo Martinique",(0,o.getPaymentConfirmationEmailHtml)(i,a,n,r))}async function x(e,t,n){let r=c(t);return s(e,"Confirmation de l'annulation de votre abonnement Météo Martinique",(0,o.getCancellationEmailHtml)(r,n))}async function g(e,t){let n=c(t),r=d(t);return s(e,"Confirmation de changement d'abonnement Météo Martinique",(0,o.getPlanChangeEmailHtml)(n,r))}async function u(e,o,t,n){return s(e,`Facture ${n} - M\xe9t\xe9o Martinique`,`
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
          <a href="#" class="logo">M\xe9t\xe9o Martinique</a>
        </div>
        <div class="card">
          <h2>Merci pour votre paiement</h2>
          <p>Voici votre facture pour la p\xe9riode en cours.</p>
          <div class="amount">${o}</div>
          <p>Facture #${n}</p>
          <a href="${t}" class="btn">T\xe9l\xe9charger la facture (PDF)</a>
        </div>
        <div class="footer">
          <p>Merci de votre confiance.</p>
        </div>
      </div>
    </body>
    </html>
  `)}e.s(["generateReferenceCode",()=>l,"sendCancellationEmail",()=>x,"sendEmail",()=>s,"sendEmailConfirmation",()=>f,"sendInvoiceEmail",()=>u,"sendPlanChangeEmail",()=>g,"sendSMS",()=>a,"sendSMSConfirmation",()=>p])}];

//# sourceMappingURL=design-update_TypeScript_weather10_lib_f5b18b3c._.js.map