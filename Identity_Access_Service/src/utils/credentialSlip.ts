
import PDFDocument from 'pdfkit';

export const generateCredentialSlip = ( username: string, password: string) => {
    const doc = new PDFDocument({
        size: [612, 200],
        margin: 30
    });
    doc.fontSize(18).text('Credential Slip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Username: ${username}`);
    doc.text(`Password: ${password}`);
    doc.moveDown();
    doc.fontSize(12).text('Please change your password immediately.', { align: 'center' });
    doc.text('This is a system-generated document. Do not share your credentials with anyone.', { align: 'center' });
    doc.text('For questions, please contact the administrator.', { align: 'center' });
    return doc;
}