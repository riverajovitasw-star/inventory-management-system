const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logActivity = require('../utils/logger');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? 'admin' : (role === 'admin' ? 'staff' : role || 'staff');

    const user = await User.create({ name, email, password, role: assignedRole });
    const token = generateToken(user._id);

    await logActivity(req, 'REGISTER', 'User', user._id, { email: user.email, role: user.role });

    res.status(201).json({ success: true, token, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Please provide email and password' });

    // FIX: .select('+password') works correctly now that schema has select:false
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account is deactivated' });

    // FIX: Update lastLogin WITHOUT triggering the password pre-save hook
    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const token = generateToken(user._id);

    // FIX: Fetch clean user object (no password field) to return to client
    const safeUser = await User.findById(user._id);

    await logActivity(req, 'LOGIN', 'User', user._id, { email: user.email });

    res.json({ success: true, token, user: safeUser });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save(); // pre-save hook will hash the new password correctly
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};
