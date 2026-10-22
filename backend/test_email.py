
import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

required = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USERNAME",
    "SMTP_PASSWORD",
    "SMTP_FROM",
]

missing = [key for key in required if not os.getenv(key)]
if missing:
    raise SystemExit(
        f"Missing environment variables: {', '.join(missing)}"
    )

message = EmailMessage()
message["Subject"] = "BKIG Email Configuration Test"
message["From"] = os.environ["SMTP_FROM"]
message["To"] = os.environ["SMTP_USERNAME"]
message.set_content(
    "BKIG email setup is working. "
    "This is a test message, not a login OTP."
)

try:
    with smtplib.SMTP(
        os.environ["SMTP_HOST"],
        int(os.environ["SMTP_PORT"]),
        timeout=20,
    ) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(
            os.environ["SMTP_USERNAME"],
            os.environ["SMTP_PASSWORD"].replace(" ", ""),
        )
        smtp.send_message(message)

    print("SUCCESS: BKIG test email sent. Check your inbox.")
except Exception as exc:
    print(f"EMAIL TEST FAILED: {type(exc).__name__}: {exc}")
