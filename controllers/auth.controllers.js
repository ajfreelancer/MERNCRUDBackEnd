import User from '../models/User.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'sk39fj29@#Dkf02slfA!2klfF3lk';

// Signup controller
export const signup = async (req, res) => {
  const { username, email, password } = req.body; // Include email here

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Include email here
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, username }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user._id, username }, JWT_SECRET, { expiresIn: '1d' });


    res.status(200).json({ token, user: { id: user._id, username, email: user.email } });
  } catch (err) {
    console.error("Signin Error:", err);
    res.status(500).json({ message: 'Server error' });
  }
};

