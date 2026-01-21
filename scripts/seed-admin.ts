'use server';

/**
 * Admin User Seeding Script
 *
 * This script deletes existing admin users and seeds a fresh admin user.
 * Run with: npx tsx scripts/seed-admin.ts
 *
 * Admin credentials:
 * - Username: admin.mpc
 * - Password: Admin1@MPC
 * - Role: admin
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/teamboard';

async function seedAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    // Delete all existing admin users
    console.log('\nDeleting existing admin users...');
    const deleteResult = await User.deleteMany({ role: 'admin' });
    console.log(`Deleted ${deleteResult.deletedCount} admin user(s)`);

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin1@MPC', 10);

    // Create new admin user (username will be normalized to lowercase by pre-save hook)
    const adminUser = await User.create({
      name: 'Admin User',
      username: 'admin.mpc',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✓ New admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Name:', adminUser.name);
    console.log('  Username:', adminUser.username);
    console.log('  Role:', adminUser.role);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📋 Login Credentials (case-insensitive):');
    console.log('  Username: admin.mpc');
    console.log('  Password: Admin1@MPC');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB\n');
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
