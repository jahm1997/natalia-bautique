import { Router } from 'express';
import Brand from '../models/Brand.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/brands — público (solo activas)
router.get('/', async (_req, res) => {
  try {
    const brands = await Brand.find({ is_active: true })
      .sort({ sort_order: 1 })
      .populate('category_id');
    // Mapear category_id populado a "category" para compatibilidad con el frontend
    const result = brands.map(b => {
      const obj = b.toJSON();
      obj.category = obj.category_id;
      obj.category_id = b.category_id?._id || null;
      return obj;
    });
    res.json(result);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: 'Error al obtener marcas.' });
  }
});

// GET /api/brands/all — admin (todas, incluyendo inactivas)
router.get('/all', protect, adminOnly, async (_req, res) => {
  try {
    const brands = await Brand.find()
      .sort({ sort_order: 1 })
      .populate('category_id');
    const result = brands.map(b => {
      const obj = b.toJSON();
      obj.category = obj.category_id;
      obj.category_id = b.category_id?._id || null;
      return obj;
    });
    res.json(result);
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ error: 'Error al obtener marcas.' });
  }
});

// GET /api/brands/:slug — público (por slug)
router.get('/:slug', async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada.' });
    }
    res.json(brand);
  } catch (error) {
    console.error('Error al obtener marca:', error);
    res.status(500).json({ error: 'Error al obtener marca.' });
  }
});

// POST /api/brands — admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, category_id, cover_image, description, is_active, sort_order } = req.body;
    const brand = await Brand.create({
      name: name?.trim(),
      slug: slug?.trim(),
      category_id: category_id || null,
      cover_image: cover_image || '',
      description: description || '',
      is_active: is_active !== undefined ? is_active : true,
      sort_order: Number(sort_order) || 0,
    });
    res.status(201).json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una marca con ese slug.' });
    }
    console.error('Error al crear marca:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/brands/:id — admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, category_id, cover_image, description, is_active, sort_order } = req.body;
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        slug: slug?.trim(),
        category_id: category_id || null,
        cover_image: cover_image || '',
        description: description || '',
        is_active: is_active !== undefined ? is_active : true,
        sort_order: Number(sort_order) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada.' });
    }
    res.json(brand);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una marca con ese slug.' });
    }
    console.error('Error al actualizar marca:', error);
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/brands/:id/toggle — admin (toggle is_active)
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada.' });
    }
    brand.is_active = !brand.is_active;
    await brand.save();
    res.json(brand);
  } catch (error) {
    console.error('Error al toggle marca:', error);
    res.status(500).json({ error: 'Error al actualizar marca.' });
  }
});

// DELETE /api/brands/:id — admin (elimina marca + sus productos)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: 'Marca no encontrada.' });
    }
    // Eliminar productos asociados (cascade)
    await Product.deleteMany({ brand_id: req.params.id });
    res.json({ message: 'Marca y sus productos eliminados.' });
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    res.status(500).json({ error: 'Error al eliminar marca.' });
  }
});

export default router;
