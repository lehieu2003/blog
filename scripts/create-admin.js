/**
 * Script to create an admin account
 * Run: node scripts/create-admin.js
 */

require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      console.log('Please create a .env.local file with MONGODB_URI');
      process.exit(1);
    }
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('Admin account already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('You can update the password if needed.');
      
      // Update password to "admin"
      const hashedPassword = await bcrypt.hash('admin', 10);
      existingAdmin.passwordHash = hashedPassword;
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Password has been reset to: admin');
      
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      passwordHash: hashedPassword,
      role: 'admin',
    });
    
    console.log('✅ Admin account created successfully!');
    console.log('==========================================');
    console.log('Email:', 'admin@gmail.com');
    console.log('Password:', 'admin');
    console.log('==========================================');
    console.log('Please change the password after first login.');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();
