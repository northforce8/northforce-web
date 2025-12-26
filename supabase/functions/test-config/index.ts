const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Check SMTP Configuration
    const SMTP_HOST = Deno.env.get('SMTP_HOST');
    const SMTP_PORT = Deno.env.get('SMTP_PORT');
    const SMTP_USER = Deno.env.get('SMTP_USER');
    const SMTP_PASS = Deno.env.get('SMTP_PASS');
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL');

    // Check Google Calendar Configuration
    const GOOGLE_CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID');
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY');

    const config = {
      smtp: {
        host: SMTP_HOST ? '✓ Configured' : '✗ Missing',
        port: SMTP_PORT ? '✓ Configured' : '✗ Missing (default: 587)',
        user: SMTP_USER ? '✓ Configured' : '✗ Missing',
        pass: SMTP_PASS ? '✓ Configured' : '✗ Missing',
        from: FROM_EMAIL ? '✓ Configured' : '✗ Missing (default used)',
      },
      calendar: {
        calendarId: GOOGLE_CALENDAR_ID ? '✓ Configured' : '✗ Missing',
        apiKey: GOOGLE_API_KEY ? '✓ Configured' : '✗ Missing',
      },
      supabase: {
        url: Deno.env.get('SUPABASE_URL') ? '✓ Auto-configured' : '✗ Missing',
        anonKey: Deno.env.get('SUPABASE_ANON_KEY') ? '✓ Auto-configured' : '✗ Missing',
      },
      status: (SMTP_HOST && SMTP_USER && SMTP_PASS && GOOGLE_CALENDAR_ID && GOOGLE_API_KEY)
        ? '✓ All required secrets configured'
        : '⚠️ Some secrets missing',
    };

    return new Response(
      JSON.stringify(config, null, 2),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Config check error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to check configuration',
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});