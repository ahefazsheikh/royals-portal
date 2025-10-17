export function createConfirmationEmail(name: string, uid: string, qrCodeDataUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .qr-section { text-align: center; margin: 20px 0; }
          .qr-section img { max-width: 200px; }
          .footer { background: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
          .uid-box { background: white; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; font-family: monospace; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Registration Confirmed!</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for registering with Royals Webtech. Your registration has been successfully submitted.</p>
            
            <div class="uid-box">
              <strong>Your Unique ID:</strong><br>
              ${uid}
            </div>
            
            <p>Please save this ID for your records. You can use it to track your application status.</p>
            
            <div class="qr-section">
              <p><strong>Scan this QR code for verification:</strong></p>
              <img src="${qrCodeDataUrl}" alt="Verification QR Code">
            </div>
            
            <p>If you have any questions, please contact us at support@royalswebtech.com</p>
            <p>Best regards,<br><strong>Royals Webtech Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Royals Webtech. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function createStatusUpdateEmail(name: string, uid: string, status: string, message: string): string {
  const statusColors: Record<string, string> = {
    approved: "#10b981",
    rejected: "#ef4444",
    pending: "#f59e0b",
    shortlisted: "#3b82f6",
  }

  const statusColor = statusColors[status] || "#6b7280"

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .status-badge { display: inline-block; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 4px; font-weight: bold; margin: 10px 0; }
          .footer { background: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Application Status Update</h1>
          </div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Your application status has been updated:</p>
            
            <div class="status-badge">${status.toUpperCase()}</div>
            
            <p>${message}</p>
            
            <p><strong>Application ID:</strong> ${uid}</p>
            
            <p>If you have any questions, please contact us at support@royalswebtech.com</p>
            <p>Best regards,<br><strong>Royals Webtech Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Royals Webtech. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

export function createAdminNotificationEmail(candidateName: string, uid: string, type: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .footer { background: #1f2937; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Registration</h1>
          </div>
          <div class="content">
            <p>A new ${type} registration has been submitted:</p>
            <p><strong>Candidate Name:</strong> ${candidateName}</p>
            <p><strong>Registration ID:</strong> ${uid}</p>
            <p>Please review the application in the admin dashboard.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Royals Webtech. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
