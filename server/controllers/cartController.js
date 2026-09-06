import Cart from '../models/Cart.js';

// GET current user's cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD item to cart (or increase quantity if it already exists)
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const qtyToAdd = Number(quantity) > 0 ? Number(quantity) : 1;

    const existingItem = cart.items.find((item) => {
      const id = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return id === productId?.toString();
    });

    if (existingItem) {
      existingItem.quantity += qtyToAdd;
    } else {
      cart.items.push({ product: productId, quantity: qtyToAdd });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE quantity of a specific item
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find((item) => {
      const id = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return id === req.params.productId?.toString();
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    item.quantity = Number(quantity);

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REMOVE item from cart
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => {
      const id = item.product?._id ? item.product._id.toString() : item.product?.toString();
      return id !== req.params.productId?.toString();
    });

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};