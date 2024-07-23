import path from 'path';
import { fileURLToPath } from 'url';

import nodemailer from 'nodemailer';
import Email from 'email-templates';

import config from '@/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function sendEmail(template, receiverEmail, locals) {
  try {
    await emailTemplates(template, receiverEmail, locals);
  } catch (error) {
    throw new Error(error);
  }
}

async function emailTemplates(template, receiver, locals) {
  try {
    const smtpTransport = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 465,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });
    const email = new Email({
      message: {
        from: `LoginHub <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
      },
    });

    await email.send({
      template: path.join(__dirname, '..', 'emails', template),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    throw new Error(error);
  }
}
