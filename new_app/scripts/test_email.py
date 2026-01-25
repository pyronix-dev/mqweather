import os

# Configuration
API_KEY = os.getenv("BREVO_API_KEY", "your-api-key-here")
SENDER_EMAIL = "bossjack1kalirafik@gmail.com"
SENDER_NAME = "MQ Weather Alertes"
RECIPIENT_EMAIL = "rzotime@gmail.com"
RECIPIENT_NAME = "Test User"

url = "https://api.brevo.com/v3/smtp/email"

# Logo URLs (using raw.githubusercontent.com for direct image access)
LOGO_TEXT_URL = "https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo-text.png"
LOGO_ICON_URL = "https://raw.githubusercontent.com/pyronix-dev/upwork/main/logo.png"

html_content = f"""
<!DOCTYPE html>
<html>
<head>
<style>
    body {{
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f4f7f6;
        margin: 0;
        padding: 0;
        color: #333333;
    }}
    .container {{
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }}
    .header {{
        background-color: #ffffff;
        padding: 30px 40px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
    }}
    .logo {{
        height: 60px;
        width: auto;
    }}
    .content {{
        padding: 40px;
        line-height: 1.6;
    }}
    .h1 {{
        color: #1a202c;
        font-size: 24px;
        font-weight: 700;
        margin-bottom: 20px;
        text-align: center;
    }}
    .otp-box {{
        background-color: #f0fdf4;
        border: 2px solid #bbf7d0;
        border-radius: 12px;
        padding: 20px;
        text-align: center;
        margin: 30px 0;
    }}
    .otp-code {{
        font-family: 'Courier New', monospace;
        font-size: 32px;
        font-weight: bold;
        color: #15803d;
        letter-spacing: 5px;
    }}
    .footer {{
        background-color: #f8fafc;
        padding: 20px 40px;
        text-align: center;
        font-size: 12px;
        color: #94a3b8;
    }}
    .btn {{
        display: inline-block;
        background-color: #0f172a;
        color: #ffffff;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: bold;
        margin-top: 20px;
    }}
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="{LOGO_TEXT_URL}" alt="MQ Weather Logo" class="logo">
        </div>
        <div class="content">
            <h1 class="h1">Vérifiez votre adresse email</h1>
            <p>Bonjour,</p>
            <p>Merci de vous être inscrit à <strong>MQ Weather</strong>. Pour finaliser votre inscription et recevoir les alertes météo, veuillez utiliser le code de vérification ci-dessous :</p>
            
            <div class="otp-box">
                <div class="otp-code">123456</div>
            </div>
            
            <p>Ce code est valable pendant 10 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            <br>
            <p>Cordialement,<br>L'équipe MQ Weather</p>
        </div>
        <div class="footer">
            <img src="{LOGO_ICON_URL}" alt="Icon" width="30" height="30" style="margin-bottom: 10px; opacity: 0.8;">
            <p>&copy; 2026 MQ Weather. Tous droits réservés.</p>
            <p>Martinique, France</p>
        </div>
    </div>
</body>
</html>
"""

payload = {
    "sender": {
        "name": SENDER_NAME,
        "email": SENDER_EMAIL
    },
    "to": [
        {
            "email": RECIPIENT_EMAIL,
            "name": RECIPIENT_NAME
        }
    ],
    "subject": "Votre code de vérification MQ Weather",
    "htmlContent": html_content
}

headers = {
    "accept": "application/json",
    "content-type": "application/json",
    "api-key": API_KEY
}

print(f"Sending styled email to {RECIPIENT_EMAIL}...")

try:
    response = requests.post(url, json=payload, headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("✅ Styled email sent successfully!")
    else:
        print("❌ Failed to send email.")

except Exception as e:
    print(f"❌ Error occurred: {e}")
