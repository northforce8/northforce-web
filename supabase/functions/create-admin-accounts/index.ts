import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const accounts = [
      { email: 'ps@northforce.io', password: 'NorthForce2024!' },
      { email: 'admin@northforce.io', password: 'Admin123!' }
    ];

    const results = [];

    for (const account of accounts) {
      const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { role: 'admin' }
      });

      if (createError) {
        if (createError.message.toLowerCase().includes('already') || createError.message.toLowerCase().includes('registered')) {
          const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

          if (listError) {
            results.push({ email: account.email, status: 'error', message: listError.message });
            continue;
          }

          const existingUser = users.find(u => u.email === account.email);

          if (existingUser) {
            const { data: updateData, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
              existingUser.id,
              {
                password: account.password,
                email_confirm: true,
                user_metadata: { role: 'admin' }
              }
            );

            if (updateError) {
              results.push({ email: account.email, status: 'error', message: updateError.message });
            } else {
              results.push({
                email: account.email,
                status: 'updated',
                id: existingUser.id,
                password: account.password
              });
            }
          } else {
            results.push({ email: account.email, status: 'error', message: 'User not found after list' });
          }
        } else {
          results.push({ email: account.email, status: 'error', message: createError.message });
        }
      } else {
        results.push({
          email: account.email,
          status: 'created',
          id: createData.user.id,
          password: account.password
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results,
        message: 'Admin accounts processed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});