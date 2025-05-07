const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Hospital } = require('./model');

// MongoDB connection string
const mongoURI = 'mongodb+srv://pratik13705:P0zbpdV5fVvrN82O@blood-donation.n7r7xng.mongodb.net/?retryWrites=true&w=majority&appName=Blood-Donation';

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    addHospitals();
  })
  .catch(err => {
    console.error('Could not connect to MongoDB', err);
  });

async function addHospitals() {
  try {
    // Add specialized blood banks and donation centers with real data
    const specializedBloodBanks = [
      // Major standalone blood banks
      {
        name: 'Ahmedabad Blood Bank',
        email: 'ahmedabad.blood.bank@example.com',
        password: 'Password123',
        address: 'Civil Hospital Campus, Asarwa, Ahmedabad-380016',
        phone: '9179226223',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Major public blood bank serving entire Ahmedabad region with advanced blood component separation facilities.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Blood Component Separation', 'Mobile Blood Collection'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Kusum Dhirajlal Memorial Blood Bank',
        email: 'kusum.blood.bank@example.com',
        password: 'Password123',
        address: 'Tagore Road, Rajkot-360002',
        phone: '9172231144',
        district: 'Rajkot',
        state: 'Gujarat',
        description: 'One of the oldest blood banks in Saurashtra region serving patients with rare blood groups and components.',
        services: ['Blood Donation', 'Blood Testing', 'Rare Blood Group Storage', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Indu Blood Bank',
        email: 'indu.blood.bank@example.com',
        password: 'Password123',
        address: 'Athwalines, Surat-395001',
        phone: '9172244330',
        district: 'Surat',
        state: 'Gujarat',
        description: 'Modern blood bank with state-of-the-art equipment and 24/7 blood component services.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Component Separation', 'Platelet Donation'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Baroda Blood Bank',
        email: 'baroda.blood.bank@example.com',
        password: 'Password123',
        address: 'Race Course Road, Vadodara-390007',
        phone: '9172654321',
        district: 'Vadodara',
        state: 'Gujarat',
        description: 'Premier blood bank in Vadodara with facilities for component separation and blood storage.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Blood Component Separation'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Gandhinagar Blood Center',
        email: 'gandhinagar.blood.center@example.com',
        password: 'Password123',
        address: 'Sector 12, Gandhinagar-382012',
        phone: '9172781234',
        district: 'Gandhinagar',
        state: 'Gujarat',
        description: 'Government supported blood center serving the capital region with modern facilities.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Specialized centers for rare blood groups
      {
        name: 'Rare Blood Group Center',
        email: 'rare.blood.group@example.com',
        password: 'Password123',
        address: 'Civil Hospital Campus, Rajkot-360001',
        phone: '9172237890',
        district: 'Rajkot',
        state: 'Gujarat',
        description: 'Specialized center focusing on collection and storage of rare blood groups for emergency needs.',
        services: ['Rare Blood Group Storage', 'Blood Donation', 'Blood Testing', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Mobile blood collection services
      {
        name: 'Jeevan Mobile Blood Services',
        email: 'jeevan.mobile@example.com',
        password: 'Password123',
        address: 'Ring Road, Bhavnagar-364001',
        phone: '9172514433',
        district: 'Bhavnagar',
        state: 'Gujarat',
        description: 'Mobile blood collection service organizing camps across the district for blood donation.',
        services: ['Mobile Blood Collection', 'Blood Testing', 'Blood Donation', 'Community Awareness'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Blood research centers
      {
        name: 'Gujarat Blood Research Institute',
        email: 'gbri@example.com',
        password: 'Password123',
        address: 'Science City Road, Ahmedabad-380060',
        phone: '9179234567',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Research institute focused on blood component research and transfusion medicine training.',
        services: ['Research', 'Blood Testing', 'Specialized Blood Units', 'Medical Education'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Additional district hospitals
      {
        name: 'Junagadh Civil Hospital Blood Bank',
        email: 'junagadh.blood.bank@example.com',
        password: 'Password123',
        address: 'M.G. Road, Junagadh-362001',
        phone: '9172653344',
        district: 'Junagadh',
        state: 'Gujarat',
        description: 'Government hospital blood bank serving Junagadh district with essential blood services.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Mehsana District Blood Bank',
        email: 'mehsana.blood.bank@example.com',
        password: 'Password123',
        address: 'Hospital Road, Mehsana-384002',
        phone: '9172789900',
        district: 'Mehsana',
        state: 'Gujarat',
        description: 'District blood bank providing blood services to northern Gujarat region.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Kutch Blood Services',
        email: 'kutch.blood.services@example.com',
        password: 'Password123',
        address: 'Hospital Road, Bhuj-370001',
        phone: '9172834455',
        district: 'Kutch',
        state: 'Gujarat',
        description: 'Blood services provider for the remote areas of Kutch district with mobile services.',
        services: ['Blood Donation', 'Blood Testing', 'Mobile Blood Collection', 'Emergency Services'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      // Major private hospitals with blood banks
      {
        name: 'Apollo Blood Bank',
        email: 'apollo.blood.bank@example.com',
        password: 'Password123',
        address: 'S.G. Highway, Ahmedabad-380054',
        phone: '9179277788',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Modern blood bank attached to Apollo Hospital with advanced component separation technology.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Blood Component Separation', 'Specialized Blood Units'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      },
      {
        name: 'Zydus Blood Center',
        email: 'zydus.blood@example.com',
        password: 'Password123',
        address: 'S.G. Road, Ahmedabad-380015',
        phone: '9179298765',
        district: 'Ahmedabad',
        state: 'Gujarat',
        description: 'Advanced blood center with modern equipment for blood component separation and storage.',
        services: ['Blood Donation', 'Blood Testing', 'Blood Storage', 'Blood Component Separation'],
        approvalStatus: 'approved',
        approvalDate: new Date(),
        verified: true
      }
    ];

    // Check if hospitals already exist by email
    console.log('Adding specialized blood banks and hospitals...');
    let addCount = 0;
    
    for (const hospital of specializedBloodBanks) {
      // Check if hospital with this email already exists
      const existingHospital = await Hospital.findOne({ email: hospital.email });
      
      if (!existingHospital) {
        // Encrypt the password
        const salt = await bcrypt.genSalt(10);
        hospital.password = await bcrypt.hash(hospital.password, salt);
        
        // Add to database
        await Hospital.create(hospital);
        addCount++;
        console.log(`Added: ${hospital.name}`);
      } else {
        console.log(`Skipped (already exists): ${hospital.name}`);
      }
    }
    
    console.log(`Successfully added ${addCount} new hospitals to the database`);
  } catch (err) {
    console.error('Error adding hospitals:', err);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
} 