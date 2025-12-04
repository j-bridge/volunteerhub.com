from __future__ import annotations

import smtplib
import ssl
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Iterable, Sequence

from flask import current_app, render_template


def _bool(value) -> bool:
    if isinstance(value, bool):
        return value
    return str(value).lower() in ("1", "true", "yes", "y", "on")


def _as_list(recipients: str | Sequence[str]) -> list[str]:
    if isinstance(recipients, str):
        return [recipients]
    return list(recipients)


def email_configured() -> bool:
    cfg = current_app.config
    return bool(cfg.get("SMTP_HOST") and cfg.get("SMTP_USERNAME") and cfg.get("SMTP_PASSWORD"))


def _html_to_text(html: str) -> str:
    """Very lightweight HTML→text fallback."""
    return re.sub(r"<[^>]+>", "", html).replace("&nbsp;", " ").strip()


def render_email_template(template_name: str, **context) -> str:
    """Render an email template stored under app/templates/email/."""
    return render_template(f"email/{template_name}", **context)


def send_email(subject: str, recipients: str | Iterable[str], text_body: str, html_body: str | None = None) -> bool:
    """
    Send an email via SMTP. Returns True on success, False on failure or when not configured.
    """
    app = current_app
    if not email_configured():
        app.logger.info("Email not configured; skipping send to %s (%s)", recipients, subject)
        return False

    cfg = app.config
    host: str = str(cfg.get("SMTP_HOST") or "")
    username: str = str(cfg.get("SMTP_USERNAME") or "")
    password: str = str(cfg.get("SMTP_PASSWORD") or "")
    port = int(cfg.get("SMTP_PORT", 587))
    use_tls = _bool(cfg.get("SMTP_USE_TLS", True))
    sender = str(cfg.get("MAIL_DEFAULT_SENDER") or username)

    if not host or not username or not password:
        app.logger.warning("SMTP configuration incomplete; skipping send to %s (%s)", recipients, subject)
        return False

    to_list = _as_list(list(recipients) if not isinstance(recipients, str) else recipients)

    msg = MIMEMultipart("alternative") if html_body else MIMEText(text_body)
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = ", ".join(to_list)

    # Attach text / html bodies
    if isinstance(msg, MIMEMultipart):
        msg.attach(MIMEText(text_body, "plain"))
        if html_body:
            msg.attach(MIMEText(html_body, "html"))
    else:
        msg.set_payload(text_body)

    try:
        if use_tls:
            context = ssl.create_default_context()
            with smtplib.SMTP(host, port, timeout=10) as server:
                server.starttls(context=context)
                server.login(username, password)
                server.sendmail(sender, to_list, msg.as_string())
        else:
            with smtplib.SMTP(host, port, timeout=10) as server:
                server.login(username, password)
                server.sendmail(sender, to_list, msg.as_string())
        app.logger.info("Email sent to %s (%s)", to_list, subject)
        return True
    except Exception as exc:  # pragma: no cover - defensive logging
        app.logger.exception("Failed to send email to %s: %s", to_list, exc)
        return False


def send_templated_email(
    subject: str,
    recipients: str | Iterable[str],
    template_name: str,
    context: dict | None = None,
) -> bool:
    """
    Convenience wrapper to render an HTML email template and send it with a plain-text fallback.
    """
    ctx = context or {}
    html_body = render_email_template(template_name, **ctx)
    text_body = ctx.get("text_body") or _html_to_text(html_body)
    return send_email(subject=subject, recipients=recipients, text_body=text_body, html_body=html_body)
