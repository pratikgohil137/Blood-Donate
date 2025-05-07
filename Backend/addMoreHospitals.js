const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Hospital } = require('./model');

// Output start message
console.log('Starting hospital addition script...');

// MongoDB connection string
const mongoURI = 'mongodb+srv://pratik13705:P0zbpdV5fVvrN82O@blood-donation.n7r7xng.mongodb.net/?retryWrites=true&w=majority&appName=Blood-Donation';

console.log('Connecting to MongoDB...');

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
    addSpecializedHospitals();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function addSpecializedHospitals() {
  console.log('Starting specialized hospital addition function...');
  try {
    // Add specialized blood banks and donation centers with real data
    const specializedBloodBanks = [
      // Centers for thalassemia patients
      {
        name: 'Thalassemia Care Center',
        email: 'thalassemia.care@example.com',
        password: 'Password123',
        address: 'Satellite Road, Ahmedabad-380015',
        phone: '9179345678',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Specialized center for treating thalassemia patients with regular blood transfusion services.',
        services: ['Blood Transfusion', 'Blood Testing', 'Patient Care', 'Specialized Blood Units'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Hemophilia treatment centers
      {
        name: 'Hemophilia Treatment Society',
        email: 'hemophilia.society@example.com',
        password: 'Password123',
        address: 'C.G. Road, Ahmedabad-380009',
        phone: '9179456789',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Dedicated center for hemophilia patients providing factor concentrates and blood products.',
        services: ['Blood Products', 'Factor Concentrates', 'Patient Support', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Pediatric blood service centers
      {
        name: 'Children\'s Blood Services',
        email: 'children.blood@example.com',
        password: 'Password123',
        address: 'Nr. Children\'s Hospital, Surat-395008',
        phone: '9172235566',
        district: 'Surat',
        state: 'Gujarat',
        description: 'Specialized blood service center for pediatric patients with focus on small volume donations.',
        services: ['Pediatric Blood Services', 'Blood Testing', 'Small Volume Collection', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Sickle cell disease centers
      {
        name: 'Sickle Cell Disease Foundation',
        email: 'sickle.cell@example.com',
        password: 'Password123',
        address: 'Opposite Civil Hospital, Valsad-396001',
        phone: '9172664433',
        district: 'Valsad',
        state: 'Gujarat',
        description: 'Foundation dedicated to helping patients with sickle cell disease through blood transfusion services.',
        services: ['Blood Transfusion', 'Genetic Counseling', 'Patient Support', 'Blood Testing'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Transplant centers with blood banks
      {
        name: 'Organ Transplant Institute Blood Bank',
        email: 'transplant.bloodbank@example.com',
        password: 'Password123',
        address: 'SG Highway, Ahmedabad-380054',
        phone: '9179211234',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Specialized blood bank supporting organ transplantation procedures with dedicated services.',
        services: ['Blood Donation', 'Blood Storage', 'Specialized Blood Units', 'Transplant Support'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      }
    ];

    console.log(`Prepared ${specializedBloodBanks.length} hospitals for addition`);

    // Check if hospitals already exist by email
    console.log('Starting hospital addition process...');
    let addCount = 0;
    
    for (const hospital of specializedBloodBanks) {
      console.log(`Processing: ${hospital.name}`);
      
      // Check if hospital with this email already exists
      console.log(`Checking if ${hospital.email} already exists...`);
      const existingHospital = await Hospital.findOne({ email: hospital.email });
      
      if (!existingHospital) {
        console.log(`${hospital.email} not found, adding new hospital...`);
        
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        hospital.password = await bcrypt.hash(hospital.password, salt);
        
        // Add to database
        const newHospital = await Hospital.create(hospital);
        addCount++;
        console.log(`Added: ${hospital.name} with ID: ${newHospital._id}`);
      } else {
        console.log(`Skipped (already exists): ${hospital.name}`);
      }
    }
    
    console.log(`Script completed. Successfully added ${addCount} new hospitals to the database`);
  } catch (err) {
    console.error('ERROR during hospital addition:', err);
  } finally {
    console.log('Closing MongoDB connection...');
    mongoose.disconnect();
    console.log('MongoDB connection closed');
  }
} 