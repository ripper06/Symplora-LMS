const nodemailer = require("nodemailer");
const { ServerConfig } = require('../../config');

// configure transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ServerConfig.EMAIL_USER,  // Gmail address from config
    pass: ServerConfig.EMAIL_PASS   // Gmail App Password (not real password!)
  }
});

const sendEmployeeWelcomeMail = async (employee) => {
  const mailOptions = {
    from: `"LMS System" <${ServerConfig.EMAIL_USER}>`,
    to: employee.email,
    subject: "Welcome to Leave Management System",
    html: `
      <h2>Hi ${employee.name},</h2>
      <p>You have been successfully added to the Leave Management System.</p>
      <p><strong>Details:</strong></p>
      <ul>
        <li><b>Name:</b> ${employee.name}</li>
        <li><b>Email:</b> ${employee.email}</li>
        <li><b>Department:</b> ${employee.department}</li>
        <li><b>Employee ID:</b> ${employee.emp_id}</li>
      </ul>
      <p><strong>Temporary Password:</strong> ${employee.tempPassword}</p>
      <p><em>Please change this password on your first login.</em></p>
      <p>Use this system to apply for and track your leaves.</p>
      <p>Best Regards,<br/>HR Team</p>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Mail sent:", info.response);
  } catch (err) {
    console.error("❌ Error sending mail:", err.message);
  }
};

module.exports = {
  sendEmployeeWelcomeMail
};
