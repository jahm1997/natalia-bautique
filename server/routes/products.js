import { Router } from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

// GET /api/products?brand_id=X — público (solo activos)
router.get('/', async (req, res) => {
  try {
    const filter = { is_active: true };
    if (req.query.brand_id) filter.brand_id = req.query.brand_id;
    const products = await Product.find(filter).sort({ sort_order: 1 });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// GET /api/products/all?brand_id=X — admin (todos, incluyendo inactivos)
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const filter = {};
    if (req.query.brand_id) filter.brand_id = req.query.brand_id;
    const products = await Product.find(filter).sort({ sort_order: 1 });
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos.' });
  }
});

// POST /api/products — admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { brand_id, name, description, price, image_url, is_active, sort_order } = req.body;
    const product = await Product.create({
      brand_id,
      name: name?.trim(),
      description: description || '',
      price: Number(price) || 20000,
      image_url: image_url || '',
      is_active: is_active !== undefined ? is_active : true,
      sort_order: Number(sort_order) || 0,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(400).json({ error: error.message });
  }
});

// PUT /api/products/:id — admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { brand_id, name, description, price, image_url, is_active, sort_order } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        brand_id,
        name: name?.trim(),
        description: description || '',
        price: Number(price) || 20000,
        image_url: image_url || '',
        is_active: is_active !== undefined ? is_active : true,
        sort_order: Number(sort_order) || 0,
      },
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/products/:id/toggle — admin (toggle is_active)
router.patch('/:id/toggle', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    product.is_active = !product.is_active;
    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error al toggle producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto.' });
  }
});

// PATCH /api/products/bulk-price — admin (cambiar precio masivo por marca)
router.patch('/bulk-price', protect, adminOnly, async (req, res) => {
  try {
    const { brand_id, price } = req.body;
    if (!brand_id || !price) {
      return res.status(400).json({ error: 'brand_id y price son requeridos.' });
    }
    const result = await Product.updateMany(
      { brand_id },
      { price: Number(price) }
    );
    res.json({ message: `Precio actualizado en ${result.modifiedCount} productos.` });
  } catch (error) {
    console.error('Error al actualizar precios:', error);
    res.status(500).json({ error: 'Error al actualizar precios.' });
  }
});

// DELETE /api/products/:id — admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto eliminado.' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto.' });
  }
});

export default router;
