const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Product = require('./models/Product');

const users = [
  {
    name: 'Abhay Admin',
    email: 'admin@abhaycycle.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    password: 'password123',
    role: 'customer',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    role: 'customer',
  },
];

const products = [
  // ── MTB ─────────────────────────────────────────────
  {
    name: 'Hero Sprint Pro MTB 27.5',
    description: 'Premium mountain bike with 21-speed Shimano gears, front suspension fork and alloy frame. Built for rough trails and steep climbs.',
    price: 18999,
    discountPrice: 15999,
    category: 'MTB',
    brand: 'Hero',
    stock: 15,
    images: ['/uploads/mtb1.jpg'],
    isFeatured: true,
    specs: {
      frameSize: '17 inch',
      gears: '21 Speed Shimano',
      brakeType: 'Disc Brake',
      wheelSize: '27.5 inch',
      weight: '13.5 kg',
      color: 'Matte Black',
      material: 'Aluminium Alloy',
    },
  },
  {
    name: 'Firefox Revolver MTB 26',
    description: 'Lightweight MTB with 24-speed gearing, dual disc brakes and front suspension. Perfect for trail riding and off-road adventures.',
    price: 24999,
    discountPrice: 21499,
    category: 'MTB',
    brand: 'Firefox',
    stock: 10,
    images: ['/uploads/mtb2.jpg'],
    isFeatured: true,
    specs: {
      frameSize: '18 inch',
      gears: '24 Speed Shimano',
      brakeType: 'Hydraulic Disc',
      wheelSize: '26 inch',
      weight: '12.8 kg',
      color: 'Neon Green',
      material: 'Aluminium Alloy',
    },
  },
  {
    name: 'Atlas Zenith MTB 29er',
    description: 'High-performance 29er mountain bike. Wider wheels offer better traction and stability on all terrains.',
    price: 32000,
    discountPrice: 28500,
    category: 'MTB',
    brand: 'Atlas',
    stock: 8,
    images: ['/uploads/mtb3.jpg'],
    isFeatured: false,
    specs: {
      frameSize: '19 inch',
      gears: '27 Speed Shimano Deore',
      brakeType: 'Hydraulic Disc',
      wheelSize: '29 inch',
      weight: '14 kg',
      color: 'Metallic Blue',
      material: 'Chromoly Steel',
    },
  },

  // ── Road Bike ─────────────────────────────────────
  {
    name: 'Firefox Road Runner 700c',
    description: 'Sleek road bike built for speed with 700c wheels, drop handlebars and Shimano 14-speed gearing. Ideal for daily commutes and long rides.',
    price: 21999,
    discountPrice: 18999,
    category: 'Road',
    brand: 'Firefox',
    stock: 12,
    images: ['/uploads/road1.jpg'],
    isFeatured: true,
    specs: {
      frameSize: '17 inch',
      gears: '14 Speed Shimano',
      brakeType: 'Caliper Brake',
      wheelSize: '700c',
      weight: '10.5 kg',
      color: 'Gloss Red',
      material: 'Aluminium Alloy',
    },
  },
  {
    name: 'Hero Lectro Swift Road 700c',
    description: 'Entry-level road bike with comfortable geometry, 7-speed Shimano gears and lightweight frame perfect for city riding.',
    price: 13999,
    discountPrice: 11999,
    category: 'Road',
    brand: 'Hero',
    stock: 20,
    images: ['/uploads/road2.jpg'],
    isFeatured: false,
    specs: {
      frameSize: '16 inch',
      gears: '7 Speed Shimano',
      brakeType: 'V-Brake',
      wheelSize: '700c',
      weight: '11 kg',
      color: 'Pearl White',
      material: 'Hi-Ten Steel',
    },
  },
  {
    name: 'Trek FX3 Hybrid Road',
    description: 'Versatile hybrid road bike that handles commuting and weekend rides with ease. Features 24 speeds and mounts for fenders and racks.',
    price: 45000,
    discountPrice: 40000,
    category: 'Road',
    brand: 'Trek',
    stock: 5,
    images: ['/uploads/road3.jpg'],
    isFeatured: true,
    specs: {
      frameSize: '18 inch',
      gears: '24 Speed Shimano Altus',
      brakeType: 'Mechanical Disc',
      wheelSize: '700c',
      weight: '9.8 kg',
      color: 'Matte Navy',
      material: 'Alpha Aluminium',
    },
  },

  // ── Kids Cycle ────────────────────────────────────
  {
    name: 'Hero Blast 20 Kids',
    description: 'Fun and durable kids cycle with training wheel support, hand brakes and a sturdy steel frame. Perfect for ages 6-10 years.',
    price: 5999,
    discountPrice: 4799,
    category: 'Kids',
    brand: 'Hero',
    stock: 25,
    images: ['/uploads/kids1.jpg'],
    isFeatured: true,
    specs: {
      frameSize: '12 inch',
      gears: 'Single Speed',
      brakeType: 'V-Brake',
      wheelSize: '20 inch',
      weight: '9 kg',
      color: 'Red & Black',
      material: 'Hi-Ten Steel',
    },
  },
  {
    name: 'Atlas Junior 16 Kids',
    description: 'Colourful lightweight kids bike with easy-grip handlebars, reflectors and a comfortable saddle. For ages 4-7 years.',
    price: 3999,
    discountPrice: 3299,
    category: 'Kids',
    brand: 'Atlas',
    stock: 30,
    images: ['/uploads/kids2.jpg'],
    isFeatured: false,
    specs: {
      frameSize: '10 inch',
      gears: 'Single Speed',
      brakeType: 'Coaster Brake',
      wheelSize: '16 inch',
      weight: '7 kg',
      color: 'Blue & Yellow',
      material: 'Hi-Ten Steel',
    },
  },
  {
    name: 'Firefox Zippy 24 Kids',
    description: 'Step up kids mountain bike with 6 speeds, front suspension and disc brakes. Great for growing riders aged 10-14 years.',
    price: 9999,
    discountPrice: 8499,
    category: 'Kids',
    brand: 'Firefox',
    stock: 18,
    images: ['/uploads/kids3.jpg'],
    isFeatured: false,
    specs: {
      frameSize: '14 inch',
      gears: '6 Speed',
      brakeType: 'Disc Brake',
      wheelSize: '24 inch',
      weight: '11 kg',
      color: 'Neon Orange',
      material: 'Aluminium Alloy',
    },
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    // Hash passwords manually since we're using insertMany
    const hashedUsers = await Promise.all(
      users.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 12) }))
    );
    await User.insertMany(hashedUsers);
    console.log(`👤 ${hashedUsers.length} users seeded`);

    await Product.insertMany(products);
    console.log(`🚴 ${products.length} products seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log('Admin Login:');
    console.log('  Email   : admin@abhaycycle.com');
    console.log('  Password: admin123');
    console.log('─────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seedDB();
