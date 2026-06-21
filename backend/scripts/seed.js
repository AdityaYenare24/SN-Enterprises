require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const { connectDatabase } = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Product = require('../models/Product');

const sampleProducts = [
  {
    name: 'Heavy Duty Cuplock Vertical Standard',
    category: 'Cuplock System',
    description: 'Heavy-duty cuplock standards and ledgers for fast locking scaffold assemblies on high-rise and industrial job sites.',
    pricePerDay: 45,
    pricePerWeek: 250,
    availabilityStatus: 'Available',
    quantity: 240,
    dimensions: '3m x 48.3mm',
    materialType: 'Galvanized Steel',
    rating: 4.8,
    featured: true,
    specifications: {
      loadCapacity: '2.5 ton',
      platformHeight: 'Up to 40m',
      weight: '13 kg',
    },
    images: [
      'https://live.staticflickr.com/6088/6072493395_092cfaab6a_b.jpg',
      'https://live.staticflickr.com/6064/6072493295_f5f5764e32_b.jpg',
    ],
  },
  {
    name: 'Adjustable Steel Props',
    category: 'Props',
    description: 'High-tensile acrow steel props for slab support and shuttering applications with reliable height adjustment and load transfer.',
    pricePerDay: 30,
    pricePerWeek: 170,
    availabilityStatus: 'Available',
    quantity: 300,
    dimensions: '2m to 3.5m',
    materialType: 'Steel',
    rating: 4.7,
    featured: true,
    images: [
      'https://live.staticflickr.com/4136/4861644806_75b04f91eb_b.jpg',
      'https://live.staticflickr.com/7028/6538776683_ed4e1c4cf5_b.jpg',
    ],
  },
  {
    name: 'Anti-Slip Walkway Planks',
    category: 'Walkway Planks',
    description: 'Anti-slip steel walkway planks for secure worker movement at height with reinforced edge locking for safer temporary platforms.',
    pricePerDay: 22,
    pricePerWeek: 120,
    availabilityStatus: 'Limited',
    quantity: 120,
    dimensions: '2.5m x 0.23m',
    materialType: 'Perforated Steel',
    rating: 4.6,
    images: [
      'https://live.staticflickr.com/6064/6073035094_3e22d5e54a.jpg',
      'https://live.staticflickr.com/6218/6250868936_d2f65f43b0.jpg',
    ],
  },
  {
    name: 'Industrial Scaffolding Pipes',
    category: 'Scaffolding Pipes',
    description: 'IS standard scaffolding pipes compatible with couplers and clamps for versatile frame and facade applications.',
    pricePerDay: 18,
    pricePerWeek: 95,
    availabilityStatus: 'Available',
    quantity: 500,
    dimensions: '6m x 48.3mm',
    materialType: 'MS Steel',
    rating: 4.5,
    images: [
      'https://live.staticflickr.com/11/13463787_e976b99580_b.jpg',
      'https://live.staticflickr.com/1435/4730579534_5c8971f438_b.jpg',
    ],
  },
  {
    name: 'Drop Forged Base Jacks',
    category: 'Base Jacks',
    description: 'Drop forged threaded base jacks for accurate leveling on uneven surfaces with superior load-bearing performance.',
    pricePerDay: 16,
    pricePerWeek: 85,
    availabilityStatus: 'Available',
    quantity: 220,
    dimensions: '600mm',
    materialType: 'Forged Steel',
    rating: 4.7,
    images: [
      'https://live.staticflickr.com/6206/6073034996_7cce9ca530.jpg',
      'https://live.staticflickr.com/6192/6072493261_510653b8fa.jpg',
    ],
  },
  {
    name: 'Adjustable U Head Jacks',
    category: 'Adjustable Jacks',
    description: 'U-head adjustable jacks for beam and slab support with precision height tuning in shuttering and scaffolding systems.',
    pricePerDay: 18,
    pricePerWeek: 96,
    availabilityStatus: 'Limited',
    quantity: 140,
    dimensions: '750mm',
    materialType: 'Steel',
    rating: 4.4,
    images: [
      'https://live.staticflickr.com/6087/6073035028_0a51335363.jpg',
      'https://live.staticflickr.com/6206/6073034996_7cce9ca530.jpg',
    ],
  },
  {
    name: 'H Frame Scaffolding Set',
    category: 'Frames',
    description: 'Hot dipped galvanized H-frame scaffolding set for quick assembly on facade and plastering works with robust side frame rigidity.',
    pricePerDay: 55,
    pricePerWeek: 300,
    availabilityStatus: 'Available',
    quantity: 160,
    dimensions: '2m x 1.2m frame',
    materialType: 'Painted Steel',
    rating: 4.6,
    featured: true,
    images: [
      'https://media.jdmart.com/mediacontent/productimage/17/6000-01703305220-65391813-1-mild-steel-hot-dipped-galvanized-h-frame-scaffolding-250.jpg?impolicy=Medium',
      'https://live.staticflickr.com/8134/30056002750_d13d21fff2_b.jpg',
    ],
  },
  {
    name: 'C Cross Bracing Set',
    category: 'Frames',
    description: 'C-type cross bracing members for H-frame scaffold bays to improve lateral stability and safe load distribution.',
    pricePerDay: 28,
    pricePerWeek: 150,
    availabilityStatus: 'Available',
    quantity: 200,
    dimensions: '2.2m x 1.2m',
    materialType: 'Galvanized Steel',
    rating: 4.6,
    images: [
      'https://live.staticflickr.com/65535/48908870151_36b5ca49e5_b.jpg',
      'https://live.staticflickr.com/7175/6686532639_eddcfc4207_b.jpg',
    ],
  },
  {
    name: 'Premium Shuttering Panels',
    category: 'Shuttering Material',
    description: 'Heavy-duty shuttering material for slab and column casting with high repeat-use life and smooth surface finish output.',
    pricePerDay: 60,
    pricePerWeek: 330,
    availabilityStatus: 'Available',
    quantity: 110,
    dimensions: '8ft x 4ft',
    materialType: 'Steel + Plywood Composite',
    rating: 4.5,
    images: [
      'https://live.staticflickr.com/219/523765208_bca260e0e5_b.jpg',
      'https://live.staticflickr.com/8464/8432577272_c834213309_b.jpg',
    ],
  },
  {
    name: 'Mobile Tower Scaffolding',
    category: 'Mobile Scaffolding',
    description: 'Mobile aluminum scaffolding tower with lockable caster wheels for maintenance and installation tasks in industrial interiors.',
    pricePerDay: 75,
    pricePerWeek: 420,
    availabilityStatus: 'Limited',
    quantity: 40,
    dimensions: 'Platform 1.8m x 0.75m',
    materialType: 'Aluminum Alloy',
    rating: 4.9,
    featured: true,
    images: [
      'https://live.staticflickr.com/65535/49558528362_737bbdaa93_b.jpg',
      'https://live.staticflickr.com/3/5914327_0cbb96218c_b.jpg',
    ],
  },
  {
    name: 'High Load Industrial Scaffolding Kit',
    category: 'Industrial Scaffolding',
    description: 'High load industrial scaffolding package designed for refineries, process plants, and shutdown maintenance projects.',
    pricePerDay: 120,
    pricePerWeek: 690,
    availabilityStatus: 'Available',
    quantity: 65,
    dimensions: 'Custom module set',
    materialType: 'Galvanized Structural Steel',
    rating: 4.8,
    featured: true,
    images: [
      'https://live.staticflickr.com/7097/6937225846_c731ed683b.jpg',
      'https://live.staticflickr.com/1570/23888757984_b60dff2fc8_b.jpg',
    ],
  },
];

const seed = async () => {
  await connectDatabase(process.env.MONGODB_URI);

  const adminEmail = (process.env.ADMIN_SEED_EMAIL || 'admin@snenterprises.com').toLowerCase();
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin@123';

  let adminUser = await User.findOne({ email: adminEmail }).select('+password');

  if (!adminUser) {
    adminUser = await User.create({
      name: 'S N Admin',
      email: adminEmail,
      phone: '+91 9511723106',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else if (adminUser.role !== 'admin') {
    adminUser.role = 'admin';
    await adminUser.save({ validateBeforeSave: false });
    console.log(`Updated user role to admin: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  await Admin.findOneAndUpdate(
    { user: adminUser._id },
    { user: adminUser._id, designation: 'Platform Administrator' },
    { upsert: true, new: true }
  );

  let insertedProducts = 0;
  let updatedProducts = 0;

  for (const productPayload of sampleProducts) {
    const existingProduct = await Product.findOne({ name: productPayload.name });

    if (!existingProduct) {
      await Product.create(productPayload);
      insertedProducts += 1;
      continue;
    }

    Object.assign(existingProduct, productPayload);
    await existingProduct.save();
    updatedProducts += 1;
  }

  console.log(`Product sync complete. Inserted: ${insertedProducts}, Updated: ${updatedProducts}`);

  await mongoose.connection.close();
  console.log('Seed complete.');
};

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await mongoose.connection.close();
  process.exit(1);
});
