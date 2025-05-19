import User from '../models/User.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sk39fj29@#Dkf02slfA!2klfF3lk';

// Signup controller
export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if email is already in use
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: 'Username already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Generate token
    const token = jwt.sign({ id: newUser._id, username }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    console.error("Signup Error:", err);

    // Handle unexpected duplicate errors (e.g., race condition)
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${duplicateField.charAt(0).toUpperCase() + duplicateField.slice(1)} already exists` });
    }

    res.status(500).json({ message: 'Server error' });
  }
};



// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body; // ✅ Changed from username to email

  try {
    const user = await User.findOne({ email }); // ✅ Query by email now
    
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email } 
    });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


