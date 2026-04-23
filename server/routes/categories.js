import { Router } from 'express';
import Category from '../models/Category.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/categories — público
router.get('/', async (_req, res) => {
  try {
    const categories = await Category.find().sort({ sort_order: 1 });
    res.json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías.' });
  }
});

// POST /api/categories — admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    const category = await Category.create({
      name: name?.trim(),
      slug: slug?.trim(),
      icon: icon || '',
      sort_order: Number(sort_order) || 0,
    });
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese slug.' });
    }
    console.error('Error al crear categoría:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/categories/:id — admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name?.trim(),
        slug: slug?.trim(),
        icon: icon || '',
        sort_order: Number(sort_order) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }
    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Ya existe una categoría con ese slug.' });
    }
    console.error('Error al actualizar categoría:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE /api/categories/:id — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada.' });
    }
    // Quitar la referencia en brands que tenían esta categoría
    const Brand = (await import('../models/Brand.js')).default;
    await Brand.updateMany({ category_id: req.params.id }, { category_id: null });

    res.json({ message: 'Categoría eliminada.' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ error: 'Error al eliminar categoría.' });
  }
});

export default router;
