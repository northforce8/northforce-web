import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ContractPDFRequest {
  contractNumber: string;
  contractType: string;
  title: string;
  customerName: string;
  customerOrgNumber?: string;
  startDate: string;
  endDate?: string;
  value?: number;
  currency?: string;
  content: string;
  version: number;
  status: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: ContractPDFRequest = await req.json();

    const pdfContent = generateContractPDF(data);
    const pdfBytes = new TextEncoder().encode(pdfContent);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="contract-${data.contractNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF", message: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

function generateContractPDF(data: ContractPDFRequest): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 2.5cm; }
    body { font-family: 'Times New Roman', serif; line-height: 1.8; color: #1f2937; font-size: 12pt; }
    .header { background: linear-gradient(135deg, #161f64 0%, #0f1642 100%); color: white; padding: 30px; text-align: center; margin-bottom: 30px; }
    .contract-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
    .content { text-align: justify; white-space: pre-wrap; }
    .signature-section { margin-top: 60px; display: flex; justify-content: space-between; }
    .signature-box { width: 45%; border-top: 2px solid #1f2937; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">${data.contractType.toUpperCase()}</h1>
    <p style="margin: 10px 0 0; font-size: 14px;">Contract Number: ${data.contractNumber}</p>
    <p style="margin: 5px 0 0; font-size: 12px;">Version ${data.version}</p>
  </div>

  <div class="contract-info">
    <h2 style="margin: 0 0 15px; color: #161f64; font-size: 18px;">${data.title}</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 8px 0; color: #6b7280; width: 30%;">Customer:</td>
        <td style="padding: 8px 0; font-weight: 600;">${data.customerName}</td>
      </tr>
      ${data.customerOrgNumber ? `<tr><td style="padding: 8px 0; color: #6b7280;">Organization Number:</td><td style="padding: 8px 0; font-weight: 600;">${data.customerOrgNumber}</td></tr>` : ""}
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Start Date:</td>
        <td style="padding: 8px 0; font-weight: 600;">${data.startDate}</td>
      </tr>
      ${data.endDate ? `<tr><td style="padding: 8px 0; color: #6b7280;">End Date:</td><td style="padding: 8px 0; font-weight: 600;">${data.endDate}</td></tr>` : ""}
      ${data.value ? `<tr><td style="padding: 8px 0; color: #6b7280;">Contract Value:</td><td style="padding: 8px 0; font-weight: 600; color: #16a34a;">${data.value.toFixed(2)} ${data.currency || "SEK"}</td></tr>` : ""}
      <tr>
        <td style="padding: 8px 0; color: #6b7280;">Status:</td>
        <td style="padding: 8px 0; font-weight: 600; text-transform: uppercase;">${data.status}</td>
      </tr>
    </table>
  </div>

  <div class="content">
    ${data.content}
  </div>

  <div class="signature-section">
    <div class="signature-box">
      <p style="margin: 0; font-weight: 600;">NorthForce</p>
      <p style="margin: 5px 0 0; font-size: 10pt; color: #6b7280;">Authorized Signatory</p>
      <p style="margin: 20px 0 0; font-size: 10pt; color: #6b7280;">Date: _________________</p>
    </div>
    <div class="signature-box">
      <p style="margin: 0; font-weight: 600;">${data.customerName}</p>
      <p style="margin: 5px 0 0; font-size: 10pt; color: #6b7280;">Authorized Signatory</p>
      <p style="margin: 20px 0 0; font-size: 10pt; color: #6b7280;">Date: _________________</p>
    </div>
  </div>

  <div style="margin-top: 80px; text-align: center; color: #9ca3af; font-size: 10pt; border-top: 1px solid #e5e7eb; padding-top: 20px;">
    <p style="margin: 0;">NorthForce — Strategic Business Solutions</p>
    <p style="margin: 5px 0 0;">northforce.io | support@northforce.io</p>
    <p style="margin: 5px 0 0;">This document is electronically generated and legally binding.</p>
  </div>
</body>
</html>`;
}
