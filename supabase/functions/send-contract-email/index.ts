import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContractEmailRequest {
  contractNumber: string;
  customerEmail: string;
  customerName: string;
  contractType: string;
  title: string;
  startDate: string;
  endDate?: string;
  value?: number;
  currency?: string;
  pdfBase64?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const emailData: ContractEmailRequest = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "NorthForce <contracts@northforce.io>";

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #161f64 0%, #0f1642 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Contract Ready for Signature</h1>
              <p style="color: #e0e7ff; margin: 8px 0 0; font-size: 14px;">NorthForce — Strategic Business Solutions</p>
            </div>

            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 24px;">Dear ${emailData.customerName},</p>

              <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px;">
                Your contract is ready for review and signature. Please find the details below.
              </p>

              <!-- Contract Details -->
              <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                <h2 style="font-size: 18px; color: #1f2937; margin: 0 0 16px; font-weight: 600;">Contract Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Contract Number:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${emailData.contractNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Type:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right; text-transform: uppercase;">${emailData.contractType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Title:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${emailData.title}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Start Date:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${emailData.startDate}</td>
                  </tr>
                  ${
                    emailData.endDate
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">End Date:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${emailData.endDate}</td>
                  </tr>
                  `
                      : ""
                  }
                  ${
                    emailData.value
                      ? `
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Contract Value:</td>
                    <td style="padding: 8px 0; color: #16a34a; font-weight: 700; text-align: right;">${emailData.value.toFixed(2)} ${emailData.currency || "SEK"}</td>
                  </tr>
                  `
                      : ""
                  }
                </table>
              </div>

              <!-- CTA Button -->
              ${
                emailData.signatureUrl
                  ? `
              <div style="text-align: center; margin: 32px 0;">
                <a href="${emailData.signatureUrl}" style="display: inline-block; background: linear-gradient(135deg, #161f64 0%, #0f1642 100%); color: white; padding: 16px 48px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                  Review & Sign Contract
                </a>
              </div>
              `
                  : ""
              }

              <!-- Instructions -->
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 600;">Next Steps</p>
                <ul style="margin: 8px 0 0; padding-left: 20px; font-size: 14px; color: #1e3a8a;">
                  <li>Review the contract carefully</li>
                  <li>Sign electronically using the link above</li>
                  <li>Contact us if you have any questions</li>
                </ul>
              </div>

              <p style="font-size: 14px; color: #6b7280; margin: 24px 0 0;">
                If you have any questions, please don't hesitate to reach out to us at <a href="mailto:contracts@northforce.io" style="color: #2563eb; text-decoration: none;">contracts@northforce.io</a>.
              </p>

              <p style="font-size: 14px; color: #6b7280; margin: 24px 0 0;">
                Best regards,<br>
                <strong style="color: #1f2937;">NorthForce Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="text-align: center; padding: 24px 20px; color: #9ca3af; font-size: 12px;">
              <p style="margin: 0 0 8px;">NorthForce — Strategic Business Solutions</p>
              <p style="margin: 0;">
                <a href="https://northforce.io" style="color: #6b7280; text-decoration: none;">northforce.io</a> |
                <a href="mailto:support@northforce.io" style="color: #6b7280; text-decoration: none;">support@northforce.io</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // If Resend is not configured, log email and return success with warning
    if (!RESEND_API_KEY) {
      console.log("=== CONTRACT EMAIL (Resend not configured) ===");
      console.log(`To: ${emailData.customerEmail}`);
      console.log(`Contract: ${emailData.contractNumber}`);
      console.log(`Type: ${emailData.contractType}`);
      console.log("===============================================");

      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service not configured. Contract email was logged but not sent.",
          requiresConfiguration: true,
          configurationSteps: [
            "1. Create account at resend.com",
            "2. Get API key from dashboard",
            "3. Add RESEND_API_KEY to edge function secrets",
            "4. Verify FROM_EMAIL domain in Resend",
          ],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Prepare email payload
    const emailPayload: any = {
      from: FROM_EMAIL,
      to: [emailData.customerEmail],
      subject: `Contract ${emailData.contractNumber} Ready for Signature`,
      html: emailHtml,
    };

    // Add PDF attachment if provided
    if (emailData.pdfBase64) {
      emailPayload.attachments = [
        {
          filename: `contract-${emailData.contractNumber}.pdf`,
          content: emailData.pdfBase64,
        },
      ];
    }

    // Send actual email using Resend API
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(`Resend API error: ${JSON.stringify(resendData)}`);
    }

    console.log(`✅ Contract email sent successfully to ${emailData.customerEmail}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Contract email sent successfully",
        emailId: resendData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error sending contract email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send contract email",
        message: error.message,
        details: "Check edge function logs for more information",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
