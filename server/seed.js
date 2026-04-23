/**
 * Seed Script — Natalia Boutique
 *
 * Crea las categorías, marcas y usuario admin iniciales.
 * Ejecutar: cd server && npm run seed
 *
 * NOTA: Es idempotente — si ya existen los datos, no los duplica.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import User from './models/User.js';
import Category from './models/Category.js';
import Brand from './models/Brand.js';

async function seed() {
  await connectDB();

  console.log('\n🌱 Iniciando seed de la base de datos...\n');

  // ═══════════════════════════════════════════════════════
  // 1. USUARIO ADMIN
  // ═══════════════════════════════════════════════════════
  const adminEmail = 'admin@nataliaboutique.com';
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    await User.create({
      email: adminEmail,
      password: 'NataliaBoutique2026!',
      role: 'admin',
    });
    console.log('✅ Usuario admin creado:');
    console.log('   📧 Email:    admin@nataliaboutique.com');
    console.log('   🔑 Password: NataliaBoutique2026!');
    console.log('   ⚠️  CAMBIA ESTA CONTRASEÑA EN PRODUCCIÓN\n');
  } else {
    console.log('ℹ️  Usuario admin ya existe, se omite.\n');
  }

  // ═══════════════════════════════════════════════════════
  // 2. CATEGORÍAS
  // ═══════════════════════════════════════════════════════
  const categoriesData = [
    { name: 'Bolsos', slug: 'bolsos', icon: '👜', sort_order: 1 },
    { name: 'Maquillaje', slug: 'maquillaje', icon: '💄', sort_order: 2 },
    { name: 'Accesorios', slug: 'accesorios', icon: '✨', sort_order: 3 },
  ];

  const categoryMap = {};

  for (const cat of categoriesData) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (!existing) {
      const created = await Category.create(cat);
      categoryMap[cat.slug] = created._id;
      console.log(`✅ Categoría creada: ${cat.icon} ${cat.name}`);
    } else {
      categoryMap[cat.slug] = existing._id;
      console.log(`ℹ️  Categoría "${cat.name}" ya existe, se omite.`);
    }
  }
  console.log('');

  // ═══════════════════════════════════════════════════════
  // 3. MARCAS (16 marcas de bolsos)
  // ═══════════════════════════════════════════════════════
  const brandsData = [
    {
      name: 'CAJITA COMBINICH',
      slug: 'cajita-combinich',
      cover_image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Elegante cajita combinich, diseño exclusivo',
      sort_order: 1,
    },
    {
      name: 'CARRIEL CHANEL',
      slug: 'carriel-chanel',
      cover_image: 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Carriel inspirado en Chanel, lujo y estilo',
      sort_order: 2,
    },
    {
      name: 'REF BELLA',
      slug: 'ref-bella',
      cover_image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Bella, bolso elegante y versátil',
      sort_order: 3,
    },
    {
      name: 'REF BIRKIN',
      slug: 'ref-birkin',
      cover_image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Birkin, icono de la moda',
      sort_order: 4,
    },
    {
      name: 'REF CHANEL KERCHIEF',
      slug: 'ref-chanel-kerchief',
      cover_image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Chanel Kerchief, sofisticación pura',
      sort_order: 5,
    },
    {
      name: 'REF COLORS',
      slug: 'ref-colors',
      cover_image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Colección Colors, variedad de tonos',
      sort_order: 6,
    },
    {
      name: 'REF ELEGANT LV',
      slug: 'ref-elegant-lv',
      cover_image: 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Elegant LV, distinción y clase',
      sort_order: 7,
    },
    {
      name: 'REF GABRIELA VELEZ',
      slug: 'ref-gabriela-velez',
      cover_image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Inspirado en Gabriela Vélez, diseño colombiano',
      sort_order: 8,
    },
    {
      name: 'REF GUCCI',
      slug: 'ref-gucci',
      cover_image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Gucci, moda italiana',
      sort_order: 9,
    },
    {
      name: 'REF LV BEEL',
      slug: 'ref-lv-beel',
      cover_image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia LV Beel, colección premium',
      sort_order: 10,
    },
    {
      name: 'REF LV LULU',
      slug: 'ref-lv-lulu',
      cover_image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia LV Lulu, elegancia en cada detalle',
      sort_order: 11,
    },
    {
      name: 'REF LV SOIT',
      slug: 'ref-lv-soit',
      cover_image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia LV Soit, línea de lujo',
      sort_order: 12,
    },
    {
      name: 'REF MALASIA',
      slug: 'ref-malasia',
      cover_image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Malasia, exotismo y estilo',
      sort_order: 13,
    },
    {
      name: 'REF PERLA',
      slug: 'ref-perla',
      cover_image: 'https://images.pexels.com/photos/1204459/pexels-photo-1204459.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Perla, delicadeza y feminidad',
      sort_order: 14,
    },
    {
      name: 'REF TRIOS LV',
      slug: 'ref-trios-lv',
      cover_image: 'https://images.pexels.com/photos/2081199/pexels-photo-2081199.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Tríos LV, sets exclusivos',
      sort_order: 15,
    },
    {
      name: 'REF VINTAGE',
      slug: 'ref-vintage',
      cover_image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Referencia Vintage, clásicos atemporales',
      sort_order: 16,
    },
  ];

  let brandsCreated = 0;
  let brandsSkipped = 0;

  for (const brand of brandsData) {
    const existing = await Brand.findOne({ slug: brand.slug });
    if (!existing) {
      await Brand.create({
        ...brand,
        category_id: categoryMap['bolsos'], // todas las marcas iniciales son bolsos
        is_active: true,
      });
      brandsCreated++;
    } else {
      brandsSkipped++;
    }
  }

  console.log(`✅ Marcas: ${brandsCreated} creadas, ${brandsSkipped} ya existían.`);

  // ═══════════════════════════════════════════════════════
  // RESUMEN
  // ═══════════════════════════════════════════════════════
  console.log('\n════════════════════════════════════════════');
  console.log('✨ Seed completado exitosamente');
  console.log('════════════════════════════════════════════');
  console.log(`   Categorías:  ${categoriesData.length}`);
  console.log(`   Marcas:      ${brandsData.length}`);
  console.log(`   Admin:       ${adminEmail}`);
  console.log('════════════════════════════════════════════\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Error en seed:', err);
  process.exit(1);
});
