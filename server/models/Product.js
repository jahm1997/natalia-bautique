import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: [true, 'La marca es requerida'],
  },
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 20000,
    min: 0,
  },
  image_url: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  sort_order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; },
  },
});

productSchema.index({ brand_id: 1 });
productSchema.index({ is_active: 1, sort_order: 1 });

export default mongoose.model('Product', productSchema);
