// Email notification service for instructor approvals
export const sendApprovalEmail = async (instructorEmail: string, instructorName: string, centreName: string) => {
  try {
    // For now, we'll use a simple email service
    // In production, you'd use SendGrid, AWS SES, or similar
    
    const emailData = {
      to: instructorEmail,
      subject: '🎉 Your BICTDA Instructor Account Has Been Approved!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Account Approved!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Welcome to BICTDA Digital Literacy Program</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${instructorName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              Great news! Your instructor account has been <strong>approved</strong> by the BICTDA administration team.
            </p>
            
            <div style="background: #e8f5e8; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3 style="color: #28a745; margin: 0 0 10px 0;">✅ Account Details:</h3>
              <p style="margin: 5px 0;"><strong>Name:</strong> ${instructorName}</p>
              <p style="margin: 5px 0;"><strong>Centre:</strong> ${centreName}</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">APPROVED</span></p>
            </div>
            
            <h3 style="color: #333; margin: 25px 0 15px 0;">🚀 What's Next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>You can now <strong>login</strong> to your instructor dashboard</li>
              <li>Access your assigned centre's trainee management system</li>
              <li>Submit weekly and monthly reports</li>
              <li>Track trainee progress and performance</li>
            </ul>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; text-align: center;">
              <h3 style="color: #333; margin: 0 0 15px 0;">🔐 Login Information</h3>
              <p style="color: #666; margin: 0;">Use the email address you registered with and your password to access your dashboard.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:8081" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Access Your Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              If you have any questions or need assistance, please contact the BICTDA support team.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>© 2024 BICTDA Digital Literacy Program. All rights reserved.</p>
          </div>
        </div>
      `
    };

    // In a real implementation, you'd send this via your email service
    console.log('📧 Email notification would be sent:', {
      to: instructorEmail,
      subject: emailData.subject,
      instructorName,
      centreName
    });

    // For demo purposes, we'll simulate a successful email send
    return { success: true, message: 'Approval email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending approval email:', error);
    throw new Error('Failed to send approval email');
  }
};

export const sendRejectionEmail = async (instructorEmail: string, instructorName: string, reason?: string) => {
  try {
    const emailData = {
      to: instructorEmail,
      subject: '❌ BICTDA Instructor Account Application Update',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; border-radius: 10px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">❌ Application Update</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">BICTDA Digital Literacy Program</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 10px; margin-top: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${instructorName},</h2>
            
            <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
              We regret to inform you that your instructor account application has been <strong>rejected</strong> by the BICTDA administration team.
            </p>
            
            ${reason ? `
              <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3 style="color: #856404; margin: 0 0 10px 0;">📝 Reason for Rejection:</h3>
                <p style="color: #856404; margin: 0;">${reason}</p>
              </div>
            ` : ''}
            
            <h3 style="color: #333; margin: 25px 0 15px 0;">🔄 What You Can Do:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Review your application information</li>
              <li>Ensure all required documents are provided</li>
              <li>Contact BICTDA support for clarification</li>
              <li>You may reapply after addressing the concerns</li>
            </ul>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              If you believe this decision was made in error, please contact the BICTDA support team for assistance.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>© 2024 BICTDA Digital Literacy Program. All rights reserved.</p>
          </div>
        </div>
      `
    };

    console.log('📧 Rejection email would be sent:', {
      to: instructorEmail,
      subject: emailData.subject,
      instructorName,
      reason
    });

    return { success: true, message: 'Rejection email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending rejection email:', error);
    throw new Error('Failed to send rejection email');
  }
};
