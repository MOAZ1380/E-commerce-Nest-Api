import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      throw new Error('EMAIL_USER or EMAIL_PASS not defined in environment variables.');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  /**
   * Sends a password reset email with a verification code.
   * @param to - The recipient's email address.
   * @param subject - The subject of the email.
   * @param code - The verification code to include in the email.
   * @returns A promise that resolves when the email is sent successfully.
   */
  async sendMail(to: string, subject: string, code: string) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `
        <div style="max-width: 500px; margin: auto; padding: 20px; font-family: Arial, sans-serif; border: 1px solid #eee; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #4CAF50;">Password Reset Request</h2>
          <p>Hi there,</p>
          <p>You requested to reset your password. Use the verification code below to proceed:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #333; background-color: #f0f0f0; padding: 10px 20px; border-radius: 5px;">${code}</span>
          </div>
          <p style="color: #999;">If you didn’t request a password reset, you can ignore this email.</p>
          <p>Thanks,<br/>Your Company Team</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email successfully sent to:', to);
      return info;
    } catch (error) {
      console.error('Failed to send email to:', to, error);
      throw error;
    }
  }
}
