const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');
const { Schema } = mongoose;
require('dotenv').config();

const app = express();

// === Middleware ===
app.use(express.json());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

// === MongoDB Connection ===
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB Error:', err));

// === Schemas ===
const categorySchema = new Schema({
  category_name: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
});

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
});

const messageSchema = new Schema({
  username: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});

const userSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  password: String,
  createdDate: { type: Date, default: Date.now },
});

const orderSchema = new Schema({
  orderid: { type: Number, required: true },
  username: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  orderdate: { type: Date, default: Date.now },
  orderamount: { type: Number, required: true },
  email: { type: String, required: true },
  status: { type: String, required: true }
});

// === Models ===
const Category = mongoose.model('categories', categorySchema);
const Product = mongoose.model('products', productSchema);
const Message = mongoose.model('messages', messageSchema);
const User = mongoose.model('users', userSchema);
const Order = mongoose.model('orders', orderSchema);

// === Auth ===
app.use('/api/auth', require('./routes/auth'));

// === Login ===
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sabit admin kontrolü
    if (email === 'admin@gmail.com') {
      if (password === '343') {
        // Admin giriş başarılı
        return res.json({
          success: true,
          message: 'Admin login successful',
          user: {
            name: 'Admin',
            email: 'admin@gmail.com',
            isAdmin: true
          }
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid password for admin' });
      }
    }

    // Normal kullanıcı kontrolü (MongoDB ve bcrypt)
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,

        isAdmin: false

      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


// === Register ===
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password || !phone || !address)
      return res.status(400).json({ message: 'All fields are required.' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, address });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// === Category Routes ===
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err });
  }
});

app.post('/api/categories', async (req, res) => {
  const { category_name, image } = req.body;
  if (!category_name || !image)
    return res.status(400).json({ message: 'Category name and image are required' });

  try {
    const newCategory = new Category({ category_name, image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const updated = await Category.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category updated', category: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating category', error: err });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err });
  }
});

// === Product Routes ===
app.get('/api/products', async (req, res) => {
  const category = req.query.category;
  try {
    const query = category ? { category: category.replace(/-/g, ' ') } : {};
    const products = await Product.find(query).sort({ _id: -1 });;
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err });
  }
});

app.post('/api/products', async (req, res) => {
  const { name, category_name, image, stock, price } = req.body;
  if (!name || !category_name || !image || !stock || !price)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const newProduct = new Product({ name, price, image, category: category_name, stock });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ message: 'Failed to save product', error: err });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

app.get("/api/products/lowstock", async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lte: 10 } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching low stock products" });
  }
});

app.put('/api/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Stock update failed' });
  }
});

// === Orders ===
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
});

app.post('/api/orders', async (req, res) => {
  const { orderId, userName, email, phone, orderDate, orderAmount, address, status } = req.body;

  if (!orderId || !userName || !email || !phone || !orderDate || !orderAmount || !address || !status)
    return res.status(400).json({ message: 'All fields are required.' });

  try {
    const newOrder = new Order({
      orderid: orderId,
      username: userName,
      email,
      phone,
      orderdate: orderDate,
      orderamount: orderAmount,
      address,
      status
    });
    await newOrder.save();
    res.json({ success: true, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
    if (!updated) return res.status(404).json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});



app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const decodedEmail = decodeURIComponent(req.params.email);
    const orders = await Order.find({ email: decodedEmail }).sort({ orderdate: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders', error: err });
  }
});

// search product
app.get('/api/products/search', async (req, res) => {
  const q = req.query.q;
  try {
    const regex = new RegExp(q, 'i'); // case-insensitive
    const results = await Product.find({ name: { $regex: regex } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});


// === Users ===
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// === Messages ===
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ _id: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err });
  }
});

app.post('/api/messages', async (req, res) => {
  try {
    const { username, email, message } = req.body;
    const newMessage = new Message({ username, email, message });
    await newMessage.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// === Serve Frontend ===
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the 'frontend/build' directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // For any other GET request that hasn't been handled by API routes or static files,
  // serve the index.html file (for single-page applications)
  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

// === Start Server ===
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
