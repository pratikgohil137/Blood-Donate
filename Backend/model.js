const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Model
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  bloodGroup: { type: String },
  age: { type: String },
  gender: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  tokens: [{ token: { type: String, required: true } }],
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  isAdmin: { type: Boolean, default: false },
  // isAdmin: { type: Boolean, default: false }, 
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  const user = this;
  console.log('Pre-save hook triggered');
  
  if (user.isModified('password')) {
    console.log('Password was modified, hashing new password');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log('Password hashed successfully');
  } else {
    console.log('Password was not modified, skipping hash');
  }
  next();
});

// Generate JWT token
UserSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, 'secretkey', { expiresIn: '1h' });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const User = mongoose.model('User', UserSchema);

// Donor Model
const DonorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bloodGroup: { type: String, required: true },
  lastDonationDate: { type: Date },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  address: { type: String, required: true },
  medicalInfo: {
    hasMedicalConditions: { type: Boolean, default: false },
    medicalConditionsDetails: { type: String },
    hasRecentSurgery: { type: Boolean, default: false },
    recentSurgeryDetails: { type: String },
    isTakingMedications: { type: Boolean, default: false },
    medicationsDetails: { type: String }
  },
  donationPreferences: {
    canDonateRegularly: { type: Boolean, default: true },
    emergencyOnly: { type: Boolean, default: false }
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' }
});

const Donor = mongoose.model('Donor', DonorSchema);

// Hospital Model
const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  description: { type: String, default: '' },
  services: [{ type: String }],
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvalDate: { type: Date },
  tokens: [{ token: { type: String } }],
  verified: { type: Boolean, default: false }
});

// Hash password before saving
HospitalSchema.pre('save', async function (next) {
  const hospital = this;
  
  if (hospital.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    hospital.password = await bcrypt.hash(hospital.password, salt);
  }
  next();
});

// Generate JWT token for hospital
HospitalSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString(), type: 'hospital' }, 'secretkey', { expiresIn: '1h' });
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

const Hospital = mongoose.model('Hospital', HospitalSchema);

// Feedback Model
const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

// Blood Camp Model
const BloodCampSchema = new mongoose.Schema({
  title: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const BloodCamp = mongoose.model('BloodCamp', BloodCampSchema);

// Blood Request Model
const BloodRequestSchema = new mongoose.Schema({
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
  bloodType: { type: String, required: true },
  units: { type: Number, required: true },
  urgency: { type: String, enum: ['urgent', 'standard'], default: 'standard' },
  patientName: { type: String, required: true },
  patientAge: { type: Number },
  patientGender: { type: String },
  purpose: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactPhone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'fulfilled', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  notes: { type: String }
});

const BloodRequest = mongoose.model('BloodRequest', BloodRequestSchema);

module.exports = { User, Donor, Hospital, Feedback, BloodCamp, BloodRequest };