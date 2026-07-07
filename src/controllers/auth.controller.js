const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_987654321';

// Generate JWT token helper
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' } // Token valid for 7 days
    );
};

// Register a new user
exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields (username, email, password) are required.'
        });
    }

    try {
        // Check if user already exists
        const existingEmail = await User.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: 'A user with this email address already exists.'
            });
        }

        const existingUsername = await User.findOne({ where: { username } });
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: 'A user with this username already exists.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (err) {
        console.error('Error during signup:', err);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred during registration.'
        });
    }
};

// Login user
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Generate token
        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: 'Logged in successfully!',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (err) {
        console.error('Error during login:', err);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred during login.'
        });
    }
};

// Get current user profile
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.error('Error in getMe:', err);
        return res.status(500).json({
            success: false,
            message: 'An internal server error occurred.'
        });
    }
};
