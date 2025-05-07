const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import the cors package
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const { User, Donor, Hospital, Feedback, BloodCamp, BloodRequest } = require('./model');
const sgMail = require('@sendgrid/mail'); // Import SendGrid Mail
const app = express();
const port = 3000;

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'pratik13705@gmail.com',
    pass: 'yqyv kxtb nrpg vwiq'
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend's URL
})); // Enable CORS for all routes

// Set your SendGrid API key
sgMail.setApiKey('YOUR_SENDGRID_API_KEY'); // Replace with your SendGrid API key

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect('mongodb+srv://pratik13705:P0zbpdV5fVvrN82O@blood-donation.n7r7xng.mongodb.net/?retryWrites=true&w=majority&appName=Blood-Donation');
    console.log('Database connected successfully');
    
    // Check and setup default admin if none exists
    await setupDefaultAdmin();
  } catch (error) {
    console.error('Database connection error:', error);
  }
};
connectDB();

// Setup default admin user if none exists
const setupDefaultAdmin = async () => {
  try {
    // Check if any admin exists
    const adminExists = await User.exists({ isAdmin: true });
    
    if (!adminExists) {
      console.log('No admin found. Creating default admin user...');
      
      // Create a default admin user
      const defaultAdmin = new User({
        name: 'Admin',
        email: 'admin@blooddonation.com',
        password: 'Admin@123', // This will be hashed by the pre-save hook
        mobile: '9999999999',
        isAdmin: true
      });
      
      console.log('Default admin object created:', {
        name: defaultAdmin.name,
        email: defaultAdmin.email,
        isAdmin: defaultAdmin.isAdmin
      });
      
      await defaultAdmin.save();
      console.log('Default admin saved successfully');
      console.log('Default admin created with email: admin@blooddonation.com');
    }
  } catch (error) {
    console.error('Error in setupDefaultAdmin:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      console.log('Admin auth: Missing Authorization header');
      return res.status(401).send({ 
        error: 'Authentication token is required',
        status: 'fail'
      });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Admin auth: Verifying token...');
    
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) {
      console.log('Admin auth: User not found with token');
      throw new Error('User not found');
    }
    
    if (!user.isAdmin) {
      console.log('Admin auth: User found but not an admin:', user.email);
      throw new Error('Not an admin user');
    }

    req.user = user;
    req.token = token;
    console.log('Admin auth successful for:', user.email);
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    res.status(403).send({ 
      error: 'Access denied: ' + error.message,
      status: 'fail'
    });
  }
};

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!user) throw new Error('Authentication failed');
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

// Hospital middleware for authentication
const hospitalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secretkey');
    const hospital = await Hospital.findOne({ _id: decoded._id, 'tokens.token': token });

    if (!hospital) throw new Error('Authentication failed');
    req.hospital = hospital;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate as a hospital' });
  }
};

// User APIs
app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/users', auth, async (req, res) => {
  const users = await User.find();
  res.send(users);
});

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt details:', {
      email,
      passwordLength: password?.length,
      timestamp: new Date().toISOString()
    });

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found with email:', email);
      throw new Error('Invalid email or password');
    }

    console.log('User found:', {
      id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
      hashedPassword: user.password?.substring(0, 10) + '...'
    });
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password comparison:', {
      isMatch,
      email: user.email
    });
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      throw new Error('Invalid email or password');
    }

    console.log('Login successful:', {
      email: user.email,
      isAdmin: user.isAdmin
    });
    
    const token = await user.generateAuthToken();
    
    res.send({ 
      user: {
        ...user.toObject(),
        password: undefined,
        tokens: undefined
      }, 
      token,
      isAdmin: user.isAdmin,
      status: 'success' 
    });
  } catch (error) {
    console.error('Login error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(400).send({ 
      error: error.message,
      status: 'fail' 
    });
  }
});

app.post('/logout', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const user = await User.findOne({ 'tokens.token': token });
    if (!user) throw new Error('Authentication failed');

    user.tokens = user.tokens.filter((t) => t.token !== token);
    await user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Forgot Password API
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received email:', email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).send({ error: 'User not found', status: 'fail' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    console.log('Reset token saved:', resetToken);

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Verify connection configuration
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (error) {
      console.error('SMTP Verification Error:', error);
      return res.status(500).send({ 
        error: 'Email server connection failed', 
        details: error.message,
        status: 'fail' 
      });
    }

    const mailOptions = {
      from: {
        name: 'Blood Donation System',
        address: 'pratik13705@gmail.com'
      },
      to: user.email,
      subject: 'Password Reset Request - Blood Donation System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for the Blood Donation System. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #d32f2f; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully. Message ID:', info.messageId);
      res.send({ 
        message: 'Password reset link sent to your email', 
        status: 'success',
        messageId: info.messageId 
      });
    } catch (error) {
      console.error('Email sending error:', {
        message: error.message,
        code: error.code,
        command: error.command
      });
      res.status(500).send({ 
        error: 'Failed to send email. Please try again later.',
        details: error.message,
        status: 'fail'
      });
    }
  } catch (error) {
    console.error('Error in /forgot-password:', error);
    res.status(500).send({ 
      error: 'Something went wrong', 
      details: error.message,
      status: 'fail' 
    });
  }
});

// Reset Password API
app.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log('1. Reset password request received for token:', token);
    console.log('2. New password length:', password.length);

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      console.log('3. No user found with valid reset token');
      return res.status(400).send({ 
        error: 'Invalid or expired token. Please request a new password reset.',
        status: 'fail' 
      });
    }

    console.log('4. Found user:', user.email);
    
    // Store the old password hash for comparison
    const oldPasswordHash = user.password;
    
    // Update password
    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    // Save user and get updated document
    const savedUser = await user.save();
    
    console.log('5. Password update complete');
    console.log('6. Old password hash:', oldPasswordHash);
    console.log('7. New password hash:', savedUser.password);

    // Verify the new password works
    const verificationTest = await bcrypt.compare(password, savedUser.password);
    console.log('8. Password verification test:', verificationTest);

    // Send confirmation email
    const mailOptions = {
      from: {
        name: 'Blood Donation System',
        address: 'pratik13705@gmail.com'
      },
      to: user.email,
      subject: 'Password Reset Successful - Blood Donation System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Password Reset Successful</h2>
          <p>Hello,</p>
          <p>Your password has been successfully reset. You can now log in with your new password.</p>
          <p>If you did not make this change, please contact support immediately.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('9. Confirmation email sent');
    } catch (error) {
      console.error('10. Error sending confirmation email:', error);
    }

    res.send({ 
      message: 'Password reset successful. You can now login with your new password.',
      status: 'success' 
    });
  } catch (error) {
    console.error('Error in password reset:', error);
    res.status(500).send({ 
      error: 'Something went wrong during password reset',
      details: error.message,
      status: 'fail'
    });
  }
});

// Donor APIs
app.post('/donors', async (req, res) => {
  try {
    const donor = new Donor(req.body);
    await donor.save();
    res.status(201).send(donor);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/donors', async (req, res) => {
  const donors = await Donor.find();
  res.send(donors);
});

// Add endpoint to delete donor record
app.delete('/donors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete the donor
    const donor = await Donor.findByIdAndDelete(id);
    
    if (!donor) {
      return res.status(404).send({ 
        error: 'Donor not found',
        status: 'fail'
      });
    }
    
    res.send({ 
      message: 'Donor record deleted successfully',
      status: 'success' 
    });
  } catch (error) {
    console.error('Error deleting donor record:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Hospital APIs
app.post('/hospitals', async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).send(hospital);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/hospitals', async (req, res) => {
  const hospitals = await Hospital.find();
  res.send(hospitals);
});

app.post('/verify-hospital/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findById(id);

    if (!hospital) {
      return res.status(404).send({ 
        error: 'Hospital not found',
        status: 'fail'
      });
    }

    hospital.verified = true; // Mark the hospital as verified
    await hospital.save();

    // Send email notification to hospital about verification
    const mailOptions = {
      from: {
        name: 'Blood Donation System',
        address: 'pratik13705@gmail.com'
      },
      to: hospital.email,
      subject: 'Hospital Verification Status - Blood Donation System',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">Hospital Verification Status</h2>
          <p>Hello ${hospital.name},</p>
          <p>We are pleased to inform you that your hospital has been <strong>verified</strong> in our Blood Donation System.</p>
          <p>Your hospital will now be prominently displayed to users seeking blood donation services.</p>
          <p>Thank you for being part of our network to save lives!</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    res.send({
      message: 'Hospital verified successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Error verifying hospital:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Generate a random verification code
const generateVerificationCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Modified organization registration to remove verification code and make admin approval required
app.post('/organization-register', async (req, res) => {
  try {
    const { name, email, password, address, phone, district, state, description, services } = req.body;
    
    // Check if email already exists
    const existingHospital = await Hospital.findOne({ email });
    if (existingHospital) {
      return res.status(400).send({ 
        error: 'Email already in use', 
        status: 'fail' 
      });
    }
    
    const hospital = new Hospital({
      name,
      email,
      password, // Will be hashed by pre-save hook
      address,
      phone,
      district,
      state,
      description: description || '',
      services: services || [],
      approvalStatus: 'pending'
    });
    
    await hospital.save();
    
    // Notify admin about new hospital registration
    try {
      const adminUsers = await User.find({ isAdmin: true });
      if (adminUsers.length > 0) {
        adminUsers.forEach(async (admin) => {
          await transporter.sendMail({
            from: 'pratik13705@gmail.com',
            to: admin.email,
            subject: 'New Hospital Registration',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d32f2f;">Blood Donation System</h2>
                <h3>New Hospital Registration</h3>
                <p>${hospital.name} has registered as a new hospital/organization.</p>
                <p>Please review the registration in the admin dashboard.</p>
              </div>
            `,
          });
        });
      }
    } catch (emailError) {
      console.error('Failed to notify admin about new registration:', emailError);
    }
    
    res.status(201).send({
      message: 'Organization registration successful. Your registration is pending admin approval. You will be notified via email when approved.',
      status: 'success'
    });
  } catch (error) {
    console.error('Error in organization registration:', error);
    res.status(500).send({ 
      error: error.message, 
      status: 'fail' 
    });
  }
});

// Modify the organization login to only allow admin-approved organizations
app.post('/organization-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hospital = await Hospital.findOne({ email });

    if (!hospital) {
      return res.status(404).send({ error: 'Organization not found' });
    }

    // Check if the organization is approved by admin
    if (hospital.approvalStatus !== 'approved') {
      return res.status(403).send({ 
        error: 'Your account is pending approval or has been rejected. Please contact the administrator.',
        status: hospital.approvalStatus
      });
    }

    const isMatch = await bcrypt.compare(password, hospital.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = await hospital.generateAuthToken();
    res.send({ 
      message: 'Login successful', 
      token,
      hospital: {
        id: hospital._id,
        name: hospital.name,
        email: hospital.email,
        address: hospital.address,
        district: hospital.district,
        state: hospital.state,
        verified: true
      }
    });
  } catch (error) {
    console.error('Error in organization login:', error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// Admin middleware - Add isAdmin field to UserSchema
app.post('/make-admin', async (req, res) => {
  try {
    const { userId, secretKey } = req.body;
    
    // Define a proper default admin key
    const DEFAULT_ADMIN_KEY = 'blood-donation-admin-2024';
    
    // Check if secret key is correct
    if (secretKey !== DEFAULT_ADMIN_KEY) {
      return res.status(403).send({ 
        error: 'Invalid secret key',
        status: 'fail'
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ 
        error: 'User not found',
        status: 'fail'
      });
    }
    
    // Add isAdmin field if it doesn't exist in the schema
    user.isAdmin = true;
    await user.save();
    
    res.send({ 
      message: 'User promoted to admin',
      status: 'success'
    });
  } catch (error) {
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Get all pending hospital registrations
app.get('/admin/pending-hospitals', adminAuth, async (req, res) => {
  try {
    const pendingHospitals = await Hospital.find({ approvalStatus: 'pending' });
    console.log('Pending hospitals found:', pendingHospitals.length);
    res.send(pendingHospitals);
  } catch (error) {
    console.error('Error fetching pending hospitals:', error);
    res.status(500).send({ error: error.message });
  }
});

// Approve or reject hospital registration
app.patch('/admin/hospital-approval/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).send({ error: 'Invalid status' });
    }
    
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).send({ error: 'Hospital not found' });
    }
    
    hospital.approvalStatus = status;
    hospital.approvalDate = new Date();
    hospital.verified = status === 'approved'; // Set verified status based on approval
    await hospital.save();
    
    // Send email notification to hospital
    const emailSubject = status === 'approved' 
      ? 'Organization Registration Approved'
      : 'Organization Registration Rejected';
      
    const emailContent = status === 'approved'
      ? `<p>Your organization ${hospital.name} has been approved. You can now login to your account.</p>`
      : `<p>Your organization ${hospital.name} registration has been rejected. Please contact administrator for more information.</p>`;
    
    try {
      await transporter.sendMail({
        from: 'pratik13705@gmail.com',
        to: hospital.email,
        subject: emailSubject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">Blood Donation System</h2>
            <h3>${emailSubject}</h3>
            ${emailContent}
            <p>Thank you for your interest in our platform.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
    
    res.send({ 
      message: `Hospital ${status}`,
      hospital
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Hospital profile management
app.get('/hospital/profile', hospitalAuth, async (req, res) => {
  try {
    // Remove sensitive information
    const hospital = req.hospital.toObject();
    delete hospital.password;
    delete hospital.tokens;
    
    res.send(hospital);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch('/hospital/profile', hospitalAuth, async (req, res) => {
  try {
    const allowedUpdates = ['name', 'address', 'phone', 'description', 'services'];
    const updates = Object.keys(req.body);
    
    // Check if updates are allowed
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
    
    // Apply updates
    updates.forEach(update => req.hospital[update] = req.body[update]);
    await req.hospital.save();
    
    // Remove sensitive information
    const hospital = req.hospital.toObject();
    delete hospital.password;
    delete hospital.tokens;
    
    res.send(hospital);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Blood Camp APIs
app.post('/blood-camps', hospitalAuth, async (req, res) => {
  try {
    console.log('Received blood camp data:', req.body);
    console.log('Hospital from auth:', req.hospital);

    const { title, date, time, venue, description, contactPerson, contactPhone } = req.body;
    
    // Validate required fields
    if (!title || !date || !time || !venue || !description || !contactPerson || !contactPhone) {
      console.log('Missing required fields:', { title, date, time, venue, description, contactPerson, contactPhone });
      return res.status(400).send({ error: 'All fields are required' });
    }

    // Ensure date is a valid Date object
    const campDate = new Date(date);
    if (isNaN(campDate.getTime())) {
      console.log('Invalid date format:', date);
      return res.status(400).send({ error: 'Invalid date format' });
    }

    const bloodCamp = new BloodCamp({
      title,
      hospital: req.hospital._id,
      date: campDate,
      time,
      venue,
      description,
      contactPerson,
      contactPhone
    });
    
    console.log('Created blood camp object:', bloodCamp);
    await bloodCamp.save();
    console.log('Blood camp saved successfully');
    
    res.status(201).send({
      message: 'Blood camp posted successfully',
      bloodCamp
    });
  } catch (error) {
    console.error('Error in blood camp creation:', error);
    res.status(500).send({ error: error.message });
  }
});

app.get('/blood-camps', async (req, res) => {
  try {
    // Get all approved blood camps from approved hospitals and populate hospital details
    const bloodCamps = await BloodCamp.find()
      .populate('hospital', 'name address district state phone')
      .sort({ date: 1 });
      
    res.send(bloodCamps);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get('/hospital/blood-camps', hospitalAuth, async (req, res) => {
  try {
    // Get blood camps for the authenticated hospital
    const bloodCamps = await BloodCamp.find({ hospital: req.hospital._id })
      .sort({ date: 1 });
      
    res.send(bloodCamps);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.patch('/blood-camps/:id', hospitalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const allowedUpdates = ['title', 'date', 'time', 'venue', 'description', 'contactPerson', 'contactPhone'];
    const updates = Object.keys(req.body);
    
    // Check if updates are allowed
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates' });
    }
    
    // Find the blood camp and check if it belongs to the authenticated hospital
    const bloodCamp = await BloodCamp.findOne({ _id: id, hospital: req.hospital._id });
    if (!bloodCamp) {
      return res.status(404).send({ error: 'Blood camp not found or unauthorized' });
    }
    
    // Apply updates
    updates.forEach(update => bloodCamp[update] = req.body[update]);
    await bloodCamp.save();
    
    res.send(bloodCamp);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.delete('/blood-camps/:id', hospitalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the blood camp and check if it belongs to the authenticated hospital
    const bloodCamp = await BloodCamp.findOneAndDelete({ _id: id, hospital: req.hospital._id });
    if (!bloodCamp) {
      return res.status(404).send({ error: 'Blood camp not found or unauthorized' });
    }
    
    res.send({
      message: 'Blood camp deleted successfully',
      bloodCamp
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Feedback API Endpoints
app.post('/feedback', async (req, res) => {
  try {
    console.log('Received feedback submission:', req.body);
    const feedback = new Feedback(req.body);
    await feedback.save();
    console.log('Feedback saved successfully:', feedback);
    res.status(201).send({ 
      message: 'Feedback submitted successfully!',
      status: 'success',
      feedback 
    });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(400).send({ 
      error: error.message, 
      status: 'fail' 
    });
  }
});

// Get all feedback - only accessible by admin in the future
app.get('/feedback', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.send(feedbacks);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// app.get('/admin-dashboard', adminAuth, (req, res) => {
//   res.send({ message: 'Welcome to the Admin Dashboard' });
// });

// Get current user info
app.get('/user-info', auth, async (req, res) => {
  try {
    // Remove sensitive information
    const user = req.user.toObject();
    delete user.password;
    
    // Keep tokens in the response but don't expose them
    user.tokens = user.tokens.length;
    
    res.send(user);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Update user profile
app.patch('/user/profile', auth, async (req, res) => {
  try {
    console.log('Received profile update request:', req.body);
    
    const allowedUpdates = ['name', 'mobile', 'bloodGroup', 'age', 'gender', 'address', 'city', 'state', 'pincode'];
    const updates = Object.keys(req.body);
    
    // Check if there are any updates to apply
    if (updates.length === 0) {
      return res.status(400).send({ 
        error: 'No valid fields to update', 
        status: 'fail' 
      });
    }
    
    console.log('Update fields:', updates);
    
    // Check if updates are allowed
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
      console.log('Invalid update fields detected:', updates.filter(update => !allowedUpdates.includes(update)));
      return res.status(400).send({ 
        error: 'Invalid updates', 
        status: 'fail'
      });
    }
    
    // Validate data types
    const validationErrors = [];
    
    if (req.body.age && isNaN(Number(req.body.age))) {
      validationErrors.push('Age must be a number');
    }
    
    if (validationErrors.length > 0) {
      return res.status(400).send({
        error: validationErrors.join(', '),
        status: 'fail'
      });
    }
    
    // Apply updates
    updates.forEach(update => req.user[update] = req.body[update]);
    
    console.log('Saving user with updated data');
    await req.user.save();
    
    // Remove sensitive information
    const user = req.user.toObject();
    delete user.password;
    delete user.tokens;
    
    console.log('User profile updated successfully');
    
    res.send({
      message: 'Profile updated successfully',
      user,
      status: 'success'
    });
  } catch (error) {
    console.error('Error in profile update:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail' 
    });
  }
});

// Check if user is admin
app.get('/check-admin', async (req, res) => {
  try {
    // Check for missing authorization header
    if (!req.header('Authorization')) {
      console.log('Check admin: Missing Authorization header');
      return res.status(401).send({ 
        error: 'Authentication token is required',
        isAdmin: false,
        status: 'fail'
      });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    console.log('Check admin: Verifying token...');
    
    // Verify token and find user
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });
    
    if (!user) {
      console.log('Check admin: User not found with token');
      return res.status(401).send({ 
        error: 'User not found',
        isAdmin: false,
        status: 'fail'
      });
    }
    
    // Check if the authenticated user is an admin
    const isAdmin = user.isAdmin === true;
    console.log(`Check admin: User ${user.email} is${isAdmin ? '' : ' not'} an admin`);
    
    res.send({ 
      isAdmin,
      userId: user._id,
      email: user.email,
      status: 'success'
    });
  } catch (error) {
    console.error('Check admin error:', error.message);
    res.status(401).send({ 
      error: error.message,
      isAdmin: false,
      status: 'fail'
    });
  }
});

// Get all approved but unverified hospitals for admin verification
app.get('/admin/unverified-hospitals', adminAuth, async (req, res) => {
  try {
    const unverifiedHospitals = await Hospital.find({ 
      approvalStatus: 'approved',
      verified: false
    });
    
    res.send(unverifiedHospitals);
  } catch (error) {
    console.error('Error fetching unverified hospitals:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Donor Registration Endpoint
app.post('/register-donor', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      bloodType,
      dateOfBirth,
      gender,
      weight,
      state,
      district,
      address,
      lastDonation,
      hasMedicalConditions,
      medicalConditionsDetails,
      hasRecentSurgery,
      recentSurgeryDetails,
      isTakingMedications,
      medicationsDetails,
      canDonateRegularly,
      emergencyOnly
    } = req.body;

    // Create new donor record
    const donor = new Donor({
      name: fullName,
      age: calculateAge(dateOfBirth),
      bloodGroup: bloodType,
      lastDonationDate: lastDonation || null,
      contact: phone,
      email: email,
      gender: gender,
      weight: weight,
      state: state,
      district: district,
      address: address,
      medicalInfo: {
        hasMedicalConditions: hasMedicalConditions === 'yes',
        medicalConditionsDetails,
        hasRecentSurgery: hasRecentSurgery === 'yes',
        recentSurgeryDetails,
        isTakingMedications: isTakingMedications === 'yes',
        medicationsDetails
      },
      donationPreferences: {
        canDonateRegularly: canDonateRegularly === 'yes',
        emergencyOnly
      },
      // Use userId if token is present but don't require it
      userId: req.user?._id || null
    });

    await donor.save();
    
    res.status(201).send({ 
      status: 'success',
      message: 'Donor registered successfully',
      donor
    });
  } catch (error) {
    console.error('Error registering donor:', error);
    res.status(400).send({ 
      status: 'fail',
      error: error.message 
    });
  }
});

// Helper function to calculate age from date of birth
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Search donors endpoint
app.get('/search-donors', async (req, res) => {
  try {
    const { bloodType, state, district } = req.query;
    
    // Build query object based on provided filters
    const query = {};
    
    if (bloodType && bloodType !== 'All Types' && bloodType !== 'All Blood Types') {
      query.bloodGroup = bloodType;
    }
    
    if (state && state !== 'All States') {
      query.state = state;
    }
    
    if (district && district !== 'All Districts') {
      query.district = district;
    }
    
    // Only return active donors
    query.status = 'active';
    
    console.log('Donor search query:', query);
    
    // Find donors matching the criteria
    const donors = await Donor.find(query);
    
    // Return count and donor data
    res.status(200).send({
      status: 'success',
      count: donors.length,
      donors: donors.map(donor => ({
        id: donor._id,
        name: donor.name,
        bloodGroup: donor.bloodGroup,
        state: donor.state,
        district: donor.district,
        contact: donor.contact,
        lastDonationDate: donor.lastDonationDate,
        canDonateRegularly: donor.donationPreferences?.canDonateRegularly,
        emergencyOnly: donor.donationPreferences?.emergencyOnly
      }))
    });
  } catch (error) {
    console.error('Error searching donors:', error);
    res.status(500).send({
      status: 'fail',
      error: error.message
    });
  }
});

// Blood Request APIs
app.post('/blood-requests', hospitalAuth, async (req, res) => {
  try {
    const { 
      bloodType, 
      units, 
      urgency, 
      patientName, 
      patientAge, 
      patientGender, 
      purpose,
      contactPerson,
      contactPhone,
      notes
    } = req.body;
    
    // Validate required fields
    if (!bloodType || !units || !patientName || !purpose || !contactPerson || !contactPhone) {
      return res.status(400).send({ 
        error: 'Missing required fields', 
        status: 'fail' 
      });
    }
    
    // Create new blood request
    const bloodRequest = new BloodRequest({
      hospital: req.hospital._id,
      bloodType,
      units,
      urgency: urgency || 'standard',
      patientName,
      patientAge,
      patientGender,
      purpose,
      contactPerson,
      contactPhone,
      notes,
      status: 'pending'
    });
    
    await bloodRequest.save();
    
    // Notify admin users about new blood request
    try {
      const adminUsers = await User.find({ isAdmin: true });
      if (adminUsers.length > 0) {
        adminUsers.forEach(async (admin) => {
          await transporter.sendMail({
            from: 'pratik13705@gmail.com',
            to: admin.email,
            subject: `New ${urgency === 'urgent' ? 'URGENT' : ''} Blood Request`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d32f2f;">Blood Donation System</h2>
                <h3>${urgency === 'urgent' ? 'URGENT' : 'New'} Blood Request</h3>
                <p>A new blood request has been submitted by ${req.hospital.name}.</p>
                <p><strong>Blood Type:</strong> ${bloodType}</p>
                <p><strong>Units Required:</strong> ${units}</p>
                <p><strong>Urgency:</strong> ${urgency || 'Standard'}</p>
                <p>Please review this request on the admin dashboard.</p>
              </div>
            `,
          });
        });
      }
    } catch (emailError) {
      console.error('Failed to notify admins about new blood request:', emailError);
    }
    
    res.status(201).send({
      message: 'Blood request submitted successfully. Pending approval.',
      bloodRequest,
      status: 'success'
    });
  } catch (error) {
    console.error('Error creating blood request:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Get all blood requests for admin
app.get('/admin/blood-requests', adminAuth, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find()
      .populate('hospital', 'name address district state phone')
      .sort({ requestDate: -1 });
    
    res.send(bloodRequests);
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Get blood requests for a specific hospital
app.get('/hospital/blood-requests', hospitalAuth, async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find({ hospital: req.hospital._id })
      .sort({ requestDate: -1 });
    
    res.send(bloodRequests);
  } catch (error) {
    console.error('Error fetching hospital blood requests:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Update blood request status (admin only)
app.patch('/admin/blood-requests/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!['pending', 'approved', 'fulfilled', 'rejected'].includes(status)) {
      return res.status(400).send({ 
        error: 'Invalid status',
        status: 'fail'
      });
    }
    
    const bloodRequest = await BloodRequest.findById(id)
      .populate('hospital', 'name email');
    
    if (!bloodRequest) {
      return res.status(404).send({ 
        error: 'Blood request not found',
        status: 'fail'
      });
    }
    
    // Update status and notes
    bloodRequest.status = status;
    if (notes) {
      bloodRequest.notes = notes;
    }
    
    await bloodRequest.save();
    
    // Notify hospital about status update
    try {
      await transporter.sendMail({
        from: 'pratik13705@gmail.com',
        to: bloodRequest.hospital.email,
        subject: `Blood Request Status Update: ${status.toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #d32f2f;">Blood Donation System</h2>
            <h3>Blood Request Update</h3>
            <p>Your blood request for ${bloodRequest.bloodType} (${bloodRequest.units} units) has been <strong>${status}</strong>.</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p>Please check your hospital dashboard for more details.</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
    
    res.send({
      message: `Blood request status updated to ${status}`,
      bloodRequest,
      status: 'success'
    });
  } catch (error) {
    console.error('Error updating blood request:', error);
    res.status(500).send({ 
      error: error.message,
      status: 'fail'
    });
  }
});

// Testing endpoint to create a pending hospital
app.get('/create-test-hospital', async (req, res) => {
  try {
    // Create a test hospital with pending approval status
    const testHospital = new Hospital({
      name: 'Test Hospital',
      email: 'test@hospital.com',
      password: 'password123', // Will be hashed by pre-save hook
      address: '123 Test Street',
      phone: '1234567890',
      district: 'Test District',
      state: 'Test State',
      approvalStatus: 'pending'
    });

    await testHospital.save();
    console.log('Test hospital created with pending status');
    
    res.send({
      message: 'Test hospital created successfully',
      hospital: {
        id: testHospital._id,
        name: testHospital.name,
        email: testHospital.email,
        approvalStatus: testHospital.approvalStatus
      }
    });
  } catch (error) {
    console.error('Error creating test hospital:', error);
    res.status(500).send({ error: error.message });
  }
});

// Testing endpoint to list all hospitals by status
app.get('/debug/hospitals', async (req, res) => {
  try {
    const pendingHospitals = await Hospital.find({ approvalStatus: 'pending' });
    const approvedHospitals = await Hospital.find({ approvalStatus: 'approved' });
    const rejectedHospitals = await Hospital.find({ approvalStatus: 'rejected' });

    res.send({
      pending: pendingHospitals.map(h => ({ 
        id: h._id, 
        name: h.name, 
        email: h.email, 
        status: h.approvalStatus 
      })),
      approved: approvedHospitals.length,
      rejected: rejectedHospitals.length,
      total: pendingHospitals.length + approvedHospitals.length + rejectedHospitals.length
    });
  } catch (error) {
    console.error('Error in debug hospitals endpoint:', error);
    res.status(500).send({ error: error.message });
  }
});

// Test admin login endpoint
app.get('/debug/admin-login', async (req, res) => {
  try {
    const admin = await User.findOne({ isAdmin: true });
    
    if (!admin) {
      return res.status(404).send({ error: 'No admin user found' });
    }
    
    const token = await admin.generateAuthToken();
    
    res.send({
      message: 'Debug admin login successful',
      token,
      adminId: admin._id,
      email: admin.email
    });
  } catch (error) {
    console.error('Error in debug admin login:', error);
    res.status(500).send({ error: error.message });
  }
});

// Direct admin login endpoint
app.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Admin login attempt:', email);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Admin login: User not found with email:', email);
      return res.status(401).send({ 
        error: 'Invalid email or password',
        status: 'fail'
      });
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      console.log('Admin login: User is not an admin:', email);
      return res.status(403).send({
        error: 'Not authorized as admin',
        status: 'fail'
      });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Admin login: Password mismatch for user:', email);
      return res.status(401).send({
        error: 'Invalid email or password',
        status: 'fail'
      });
    }
    
    // Generate admin token
    const token = await user.generateAuthToken();
    console.log('Admin login successful for:', user.email);
    
    res.send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: true
      },
      token,
      status: 'success'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).send({
      error: 'Login failed. Please try again.',
      status: 'fail'
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});