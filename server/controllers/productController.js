import Product from '../models/Product.js';
import { cloudinary } from '../config/cloudinary.js';

// GET all products (public, anyone can view)
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET single product by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE product (admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    let finalImageUrl = null;

    if (req.file) {
      finalImageUrl = req.file.path; // Cloudinary URL from Multer file upload
    } else if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      // Remote URL provided -> upload to Cloudinary so it's stored in user's Cloudinary account
      const uploadRes = await cloudinary.uploader.upload(imageUrl.trim(), {
        folder: 'ecommerce-products',
      });
      finalImageUrl = uploadRes.secure_url;
    }

    if (!finalImageUrl) {
      return res.status(400).json({ message: 'Product image file or valid image URL is required' });
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      stock: Number(stock),
      imageUrl: finalImageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE product (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.price = req.body.price ?? product.price;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;

    if (req.file) {
      product.imageUrl = req.file.path;
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string' && req.body.imageUrl.trim() && req.body.imageUrl.trim() !== product.imageUrl) {
      const uploadRes = await cloudinary.uploader.upload(req.body.imageUrl.trim(), {
        folder: 'ecommerce-products',
      });
      product.imageUrl = uploadRes.secure_url;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE product (admin only)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};