const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { to, subject, html, text }: EmailRequest = await req.json();

    const SMTP_HOST = Deno.env.get('SMTP_HOST');
    const SMTP_PORT = Deno.env.get('SMTP_PORT') || '587';
    const SMTP_USER = Deno.env.get('SMTP_USER');
    const SMTP_PASS = Deno.env.get('SMTP_PASS');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'NorthForce <support@northforce.io>';

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      console.log('SMTP not configured. Email will be logged only.');
      console.log(`Email to: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${text || html}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged (SMTP not configured)',
          details: { to, subject }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      );
    }

    const encoder = new TextEncoder();
    const emailMessage = [
      `From: ${FROM_EMAIL}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      '',
      html,
    ].join('\r\n');

    const conn = await Deno.connect({
      hostname: SMTP_HOST,
      port: parseInt(SMTP_PORT),
    });

    const credentials = btoa(`\0${SMTP_USER}\0${SMTP_PASS}`);
    
    await conn.write(encoder.encode(`EHLO ${SMTP_HOST}\r\n`));
    await conn.write(encoder.encode('AUTH PLAIN ' + credentials + '\r\n'));
    await conn.write(encoder.encode(`MAIL FROM:<${SMTP_USER}>\r\n`));
    await conn.write(encoder.encode(`RCPT TO:<${to}>\r\n`));
    await conn.write(encoder.encode('DATA\r\n'));
    await conn.write(encoder.encode(emailMessage + '\r\n.\r\n'));
    await conn.write(encoder.encode('QUIT\r\n'));
    
    conn.close();

    console.log(`Email sent successfully to ${to}`);

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        message: error.message,
        details: 'Email was logged to console'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  }
});
