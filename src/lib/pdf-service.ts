import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generateInvoicePDF(invoice: any): Blob {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(22, 31, 100);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_number, pageWidth / 2, 30, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);

  let yPos = 55;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('From:', 20, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('NorthForce', 20, yPos + 5);
  doc.text('Strategic Business Solutions', 20, yPos + 10);
  doc.text('support@northforce.io', 20, yPos + 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Bill To:', pageWidth / 2, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.customer.company_name, pageWidth / 2, yPos + 5);
  if (invoice.customer.org_number) {
    doc.text(`Org: ${invoice.customer.org_number}`, pageWidth / 2, yPos + 10);
  }
  if (invoice.customer.address) {
    doc.text(invoice.customer.address, pageWidth / 2, yPos + 15);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Invoice Details:', pageWidth - 70, yPos);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString('sv-SE')}`, pageWidth - 70, yPos + 5);
  doc.setTextColor(220, 38, 38);
  doc.text(`Due: ${new Date(invoice.due_date).toLocaleDateString('sv-SE')}`, pageWidth - 70, yPos + 10);
  doc.setTextColor(0, 0, 0);

  yPos += 35;

  const tableData = invoice.line_items.map((item: any, index: number) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    `${item.unit_price.toFixed(2)}`,
    `${item.amount.toFixed(2)}`,
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [249, 250, 251],
      textColor: [107, 114, 128],
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 80 },
      2: { cellWidth: 20, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFillColor(249, 250, 251);
  doc.rect(20, finalY, pageWidth - 40, 35, 'F');

  doc.setFontSize(10);
  doc.text('Subtotal:', pageWidth - 80, finalY + 8);
  doc.text(`${invoice.subtotal.toFixed(2)} ${invoice.currency_code}`, pageWidth - 30, finalY + 8, { align: 'right' });

  doc.text(`Tax (${invoice.tax_rate}%):`, pageWidth - 80, finalY + 16);
  doc.text(`${invoice.tax_amount.toFixed(2)} ${invoice.currency_code}`, pageWidth - 30, finalY + 16, { align: 'right' });

  doc.setFillColor(22, 31, 100);
  doc.rect(20, finalY + 22, pageWidth - 40, 13, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount Due:', pageWidth - 110, finalY + 31);
  doc.text(`${invoice.total_amount.toFixed(2)} ${invoice.currency_code}`, pageWidth - 30, finalY + 31, { align: 'right' });

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');

  if (invoice.notes) {
    const notesY = finalY + 45;
    doc.setFillColor(239, 246, 255);
    doc.rect(20, notesY, pageWidth - 40, 20, 'F');
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.line(20, notesY, 20, notesY + 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 64, 175);
    doc.text('Notes', 25, notesY + 7);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(9);
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 50);
    doc.text(splitNotes, 25, notesY + 13);
  }

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(8);
  const footerY = pageHeight - 20;
  doc.text('NorthForce — Strategic Business Solutions', pageWidth / 2, footerY, { align: 'center' });
  doc.text('northforce.io | support@northforce.io', pageWidth / 2, footerY + 5, { align: 'center' });

  return doc.output('blob');
}

export function generateContractPDF(contract: any): Blob {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFillColor(22, 31, 100);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('times', 'bold');
  doc.text(contract.contract_type.toUpperCase(), pageWidth / 2, 18, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('times', 'normal');
  doc.text(`Contract Number: ${contract.contract_number}`, pageWidth / 2, 26, { align: 'center' });
  doc.text(`Version ${contract.version}`, pageWidth / 2, 32, { align: 'center' });

  doc.setTextColor(0, 0, 0);

  let yPos = 55;

  doc.setFillColor(249, 250, 251);
  doc.rect(20, yPos, pageWidth - 40, 50, 'F');

  doc.setFontSize(14);
  doc.setFont('times', 'bold');
  doc.setTextColor(22, 31, 100);
  doc.text(contract.title, pageWidth / 2, yPos + 8, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('times', 'normal');

  const infoY = yPos + 18;
  doc.text('Customer:', 25, infoY);
  doc.setFont('times', 'bold');
  doc.text(contract.customer.company_name, 60, infoY);
  doc.setFont('times', 'normal');

  if (contract.customer.org_number) {
    doc.text('Organization Number:', 25, infoY + 6);
    doc.setFont('times', 'bold');
    doc.text(contract.customer.org_number, 60, infoY + 6);
    doc.setFont('times', 'normal');
  }

  doc.text('Start Date:', 25, infoY + 12);
  doc.setFont('times', 'bold');
  doc.text(new Date(contract.start_date).toLocaleDateString('sv-SE'), 60, infoY + 12);
  doc.setFont('times', 'normal');

  if (contract.end_date) {
    doc.text('End Date:', 25, infoY + 18);
    doc.setFont('times', 'bold');
    doc.text(new Date(contract.end_date).toLocaleDateString('sv-SE'), 60, infoY + 18);
    doc.setFont('times', 'normal');
  }

  if (contract.value) {
    doc.text('Contract Value:', 25, infoY + 24);
    doc.setFont('times', 'bold');
    doc.setTextColor(22, 163, 74);
    doc.text(`${contract.value.toFixed(2)} ${contract.currency_code || 'SEK'}`, 60, infoY + 24);
    doc.setTextColor(0, 0, 0);
    doc.setFont('times', 'normal');
  }

  doc.text('Status:', 25, infoY + 30);
  doc.setFont('times', 'bold');
  doc.text(contract.status.toUpperCase(), 60, infoY + 30);
  doc.setFont('times', 'normal');

  yPos += 70;

  doc.setFontSize(9);
  doc.setFont('times', 'normal');
  const contentLines = doc.splitTextToSize(contract.content, pageWidth - 40);

  contentLines.forEach((line: string) => {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    doc.text(line, 20, yPos);
    yPos += 5;
  });

  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  } else {
    yPos += 20;
  }

  doc.setFontSize(10);
  doc.setFont('times', 'bold');
  doc.text('Signatures', pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  const signatureWidth = (pageWidth - 50) / 2;

  doc.setDrawColor(31, 41, 55);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 20 + signatureWidth, yPos);

  doc.setFontSize(9);
  doc.setFont('times', 'bold');
  doc.text('NorthForce', 20, yPos + 5);
  doc.setFont('times', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Authorized Signatory', 20, yPos + 10);
  doc.text('Date: _________________', 20, yPos + 20);

  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(31, 41, 55);
  doc.line(pageWidth - 20 - signatureWidth, yPos, pageWidth - 20, yPos);

  doc.setFont('times', 'bold');
  doc.text(contract.customer.company_name, pageWidth - 20 - signatureWidth, yPos + 5);
  doc.setFont('times', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text('Authorized Signatory', pageWidth - 20 - signatureWidth, yPos + 10);
  doc.text('Date: _________________', pageWidth - 20 - signatureWidth, yPos + 20);

  doc.setTextColor(156, 163, 175);
  doc.setFontSize(7);
  const footerY = pageHeight - 15;
  doc.setDrawColor(229, 231, 235);
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
  doc.text('NorthForce — Strategic Business Solutions', pageWidth / 2, footerY, { align: 'center' });
  doc.text('northforce.io | support@northforce.io', pageWidth / 2, footerY + 4, { align: 'center' });
  doc.text('This document is electronically generated and legally binding.', pageWidth / 2, footerY + 8, { align: 'center' });

  return doc.output('blob');
}

export function downloadPDF(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
