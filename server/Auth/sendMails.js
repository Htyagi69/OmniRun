import { Resend } from 'resend';

const resend = new Resend('re_3XykdSsy_DXwCthb83qTVDPnJ9f4BFndS');

resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'yiwege7338@pazard.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});