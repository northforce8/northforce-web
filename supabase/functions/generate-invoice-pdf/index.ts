import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface InvoicePDFRequest {
  invoiceNumber: string;
  customerName: string;
  customerAddress?: string;
  customerOrgNumber?: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  notes?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const data: InvoicePDFRequest = await req.json();

    const pdfContent = generateInvoicePDF(data);
    const pdfBytes = new TextEncoder().encode(pdfContent);

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${data.invoiceNumber}.pdf"`,
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

function generateInvoicePDF(data: InvoicePDFRequest): string {
  const lineItemsRows = data.lineItems
    .map(
      (item, i) =>
        `<tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${i + 1}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${item.amount.toFixed(2)}</td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #1f2937; }
    .header { background: linear-gradient(135deg, #161f64 0%, #0f1642 100%); color: white; padding: 40px; text-align: center; margin-bottom: 40px; }
    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 40px; }
    .section { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
    th { background: #f9fafb; padding: 12px; text-align: left; font-weight: 600; color: #6b7280; text-transform: uppercase; font-size: 12px; }
    .summary { background: #f9fafb; padding: 20px; border-radius: 8px; }
    .total { background: #161f64; color: white; padding: 20px; text-align: right; font-size: 24px; font-weight: 700; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; font-size: 36px;">INVOICE</h1>
    <p style="margin: 10px 0 0; font-size: 18px;">${data.invoiceNumber}</p>
  </div>

  <div class="invoice-details">
    <div class="section">
      <h3 style="color: #161f64; margin: 0 0 10px;">From:</h3>
      <p style="margin: 0;"><strong>NorthForce</strong></p>
      <p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">Strategic Business Solutions</p>
      <p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">support@northforce.io</p>
    </div>
    <div class="section">
      <h3 style="color: #161f64; margin: 0 0 10px;">Bill To:</h3>
      <p style="margin: 0;"><strong>${data.customerName}</strong></p>
      ${data.customerOrgNumber ? `<p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">Org: ${data.customerOrgNumber}</p>` : ""}
      ${data.customerAddress ? `<p style="margin: 5px 0 0; font-size: 14px; color: #6b7280;">${data.customerAddress}</p>` : ""}
    </div>
    <div class="section">
      <h3 style="color: #161f64; margin: 0 0 10px;">Invoice Details:</h3>
      <p style="margin: 0; font-size: 14px;"><strong>Date:</strong> ${data.invoiceDate}</p>
      <p style="margin: 5px 0 0; font-size: 14px;"><strong style="color: #dc2626;">Due Date:</strong> <span style="color: #dc2626;">${data.dueDate}</span></p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 5%;">#</th>
        <th style="width: 45%;">Description</th>
        <th style="width: 15%; text-align: right;">Qty</th>
        <th style="width: 17.5%; text-align: right;">Unit Price</th>
        <th style="width: 17.5%; text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      ${lineItemsRows}
    </tbody>
  </table>

  <div class="summary">
    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
      <span style="color: #6b7280;">Subtotal:</span>
      <span style="font-weight: 600;">${data.subtotal.toFixed(2)} ${data.currency}</span>
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb;">
      <span style="color: #6b7280;">Tax (${data.taxRate}%):</span>
      <span style="font-weight: 600;">${data.taxAmount.toFixed(2)} ${data.currency}</span>
    </div>
    <div class="total">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>Total Amount Due:</span>
        <span>${data.totalAmount.toFixed(2)} ${data.currency}</span>
      </div>
    </div>
  </div>

  ${data.notes ? `<div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin-top: 40px;"><h4 style="margin: 0 0 10px; color: #1e40af;">Notes</h4><p style="margin: 0; color: #1e3a8a; font-size: 14px;">${data.notes}</p></div>` : ""}

  <div style="margin-top: 60px; text-align: center; color: #9ca3af; font-size: 12px;">
    <p style="margin: 0;">NorthForce — Strategic Business Solutions</p>
    <p style="margin: 5px 0 0;">northforce.io | support@northforce.io</p>
  </div>
</body>
</html>`;
}
