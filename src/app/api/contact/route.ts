import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// ─── SMTP + WhatsApp Contact API ───
// Sends form data to admin email, auto-reply to sender, and redirects to WhatsApp

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { user_name, user_email, phone, service, message } = body;

        // Validate required fields
        if (!user_name || !user_email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required.' },
                { status: 400 }
            );
        }

        // ─── SMTP Transporter ───
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const serviceName = service || 'Not specified';
        const phoneDisplay = phone || 'Not provided';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        // ─── 1. Email to Admin ───
        await transporter.sendMail({
            from: `"AKS Automations Website" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || 'aksaiautomation@gmail.com',
            subject: `🔔 New Contact Form Submission — ${user_name}`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #384bff, #6366f1); padding: 32px 24px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 22px; font-weight: 700;">New Contact Form Submission</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">${timestamp}</p>
          </div>
          <div style="padding: 28px 24px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; width: 130px;">👤 Name</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-weight: 500;">${user_name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">✉️ Email</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${user_email}" style="color: #384bff; text-decoration: none;">${user_email}</a></td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">📞 Phone</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${phoneDisplay}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600;">🛠️ Service</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1e293b;">${serviceName}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding: 16px; background: #fff; border-radius: 8px; border: 1px solid #e2e8f0;">
              <div style="color: #64748b; font-weight: 600; font-size: 13px; margin-bottom: 8px;">💬 Message</div>
              <div style="color: #1e293b; line-height: 1.7; white-space: pre-wrap;">${message}</div>
            </div>
            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${user_email}" style="display: inline-block; padding: 12px 28px; background: #384bff; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to ${user_name}</a>
            </div>
          </div>
        </div>
      `,
        });

        // ─── 2. Auto-Reply to Sender ───
        await transporter.sendMail({
            from: `"AKS Automations" <${process.env.SMTP_USER}>`,
            to: user_email,
            subject: `Thanks for reaching out, ${user_name}! — AKS Automations`,
            html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #384bff, #6366f1); padding: 40px 24px; text-align: center;">
            <div style="width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
              <span style="color: #fff; font-weight: 900; font-size: 16px;">AKS</span>
            </div>
            <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">Thank You, ${user_name}!</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 10px 0 0; font-size: 15px;">We've received your message and will get back to you within 24 hours.</p>
          </div>
          <div style="padding: 32px 24px;">
            <div style="background: #fff; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
              <h3 style="margin: 0 0 12px; color: #1e293b; font-size: 16px;">📋 Your Submission Summary</h3>
              <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
              <p style="margin: 4px 0; color: #64748b; font-size: 14px;"><strong>Message:</strong> ${message.substring(0, 150)}${message.length > 150 ? '...' : ''}</p>
            </div>
            <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 12px;">What happens next?</h3>
            <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px;">
              <div style="min-width: 28px; height: 28px; background: #384bff; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">1</div>
              <div>
                <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Team Review</div>
                <div style="color: #64748b; font-size: 13px;">Our team will review your requirements within a few hours.</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 16px;">
              <div style="min-width: 28px; height: 28px; background: #384bff; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">2</div>
              <div>
                <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Personal Response</div>
                <div style="color: #64748b; font-size: 13px;">You'll receive a detailed reply with our suggestions and next steps.</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: flex-start; margin-bottom: 24px;">
              <div style="min-width: 28px; height: 28px; background: #384bff; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;">3</div>
              <div>
                <div style="font-weight: 600; color: #1e293b; font-size: 14px;">Free Consultation</div>
                <div style="color: #64748b; font-size: 13px;">We'll schedule a free 30-min call to discuss your project in detail.</div>
              </div>
            </div>
            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; margin-bottom: 16px;">Need to talk sooner? Book a call directly:</p>
              <a href="https://calendly.com/aksaiautomation/contact" style="display: inline-block; padding: 12px 28px; background: #384bff; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">📅 Book a Free Call</a>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">AKS Automations · Pune, India · <a href="https://aksautomations.com" style="color: #384bff; text-decoration: none;">aksautomations.com</a></p>
          </div>
        </div>
      `,
        });

        // ─── 3. Build WhatsApp Message URL ───
        const whatsappNumber = process.env.WHATSAPP_NUMBER || '919156903129';
        const whatsappMessage = encodeURIComponent(
            `🔔 *New Contact Form Submission*\n\n` +
            `👤 *Name:* ${user_name}\n` +
            `✉️ *Email:* ${user_email}\n` +
            `📞 *Phone:* ${phoneDisplay}\n` +
            `🛠️ *Service:* ${serviceName}\n\n` +
            `💬 *Message:*\n${message}\n\n` +
            `📅 *Time:* ${timestamp}`
        );
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${whatsappMessage}`;

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully!',
            whatsappUrl,
        });

    } catch (error: unknown) {
        console.error('Contact form error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json(
            { error: 'Failed to send message. Please try again later.', details: errorMessage },
            { status: 500 }
        );
    }
}
