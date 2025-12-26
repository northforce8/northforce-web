import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoiceEmailRequest {
  invoiceNumber: string;
  customerEmail: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  currency: string;
  pdfBase64?: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const emailData: InvoiceEmailRequest = await req.json();
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "NorthForce <invoices@northforce.io>";

    // Build line items HTML
    const lineItemsHtml = emailData.lineItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unitPrice.toFixed(2)} ${emailData.currency}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.amount.toFixed(2)} ${emailData.currency}</td>
        </tr>
      `
      )
      .join("");

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
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Invoice ${emailData.invoiceNumber}</h1>
              <p style="color: #e0e7ff; margin: 8px 0 0; font-size: 14px;">NorthForce — Strategic Business Solutions</p>
            </div>

            <!-- Content -->
            <div style="background: white; padding: 40px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <p style="font-size: 16px; color: #1f2937; margin: 0 0 24px;">Dear ${emailData.customerName},</p>

              <p style="font-size: 14px; color: #4b5563; margin: 0 0 24px;">
                Thank you for your business. Please find your invoice details below.
              </p>

              <!-- Invoice Details -->
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Invoice Number:</td>
                    <td style="padding: 8px 0; color: #1f2937; font-weight: 600; text-align: right;">${emailData.invoiceNumber}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Invoice Date:</td>
                    <td style="padding: 8px 0; color: #1f2937; text-align: right;">${emailData.invoiceDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Due Date:</td>
                    <td style="padding: 8px 0; color: #dc2626; font-weight: 600; text-align: right;">${emailData.dueDate}</td>
                  </tr>
                </table>
              </div>

              <!-- Line Items -->
              <h2 style="font-size: 18px; color: #1f2937; margin: 0 0 16px; font-weight: 600;">Invoice Items</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Price</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <div style="background: #161f64; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="color: #e0e7ff; font-size: 18px; font-weight: 600;">Total Amount Due:</span>
                  <span style="color: white; font-size: 28px; font-weight: 700;">${emailData.totalAmount.toFixed(2)} ${emailData.currency}</span>
                </div>
              </div>

              <!-- Payment Instructions -->
              <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 14px; color: #1e40af; font-weight: 600;">Payment Instructions</p>
                <p style="margin: 8px 0 0; font-size: 14px; color: #1e3a8a;">
                  Please make payment by ${emailData.dueDate}. Contact us at <a href="mailto:invoices@northforce.io" style="color: #2563eb; text-decoration: none;">invoices@northforce.io</a> if you have any questions.
                </p>
              </div>

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
      console.log("=== INVOICE EMAIL (Resend not configured) ===");
      console.log(`To: ${emailData.customerEmail}`);
      console.log(`Invoice: ${emailData.invoiceNumber}`);
      console.log(`Amount: ${emailData.totalAmount} ${emailData.currency}`);
      console.log("===============================================");

      return new Response(
        JSON.stringify({
          success: false,
          message: "Email service not configured. Invoice email was logged but not sent.",
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
      subject: `Invoice ${emailData.invoiceNumber} from NorthForce`,
      html: emailHtml,
    };

    // Add PDF attachment if provided
    if (emailData.pdfBase64) {
      emailPayload.attachments = [
        {
          filename: `invoice-${emailData.invoiceNumber}.pdf`,
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

    console.log(`✅ Invoice email sent successfully to ${emailData.customerEmail}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Invoice email sent successfully",
        emailId: resendData.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send invoice email",
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
