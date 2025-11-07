from flask_mail import Message
from .extensions import mail
import threading

def _send_async(msg):
    try:
        mail.send(msg)
    except Exception:
        pass

def send_email(subject: str, recipients: list, body: str, html: str = None):
    msg = Message(subject=subject, recipients=recipients, body=body, html=html)
    thr = threading.Thread(target=_send_async, args=(msg,))
    thr.start()

def notify_application_status_change(user_email: str, user_name: str, opportunity_title: str, new_status: str):
    subject = f"Your application for '{opportunity_title}' was {new_status}"
    body = f"Hi {user_name or ''},\n\nYour application for '{opportunity_title}' has been updated to: {new_status}.\n\nRegards,\nVolunteerHub"
    send_email(subject, [user_email], body)
