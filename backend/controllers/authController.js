const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// ==================== SIGN UP ====================

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // Check existing email
        const existingEmail = await User.findOne({
            where: { email },
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Check existing phone
        const existingPhone = await User.findOne({
            where: { phone },
        });

        if (existingPhone) {
            return res.status(409).json({
                success: false,
                message: "Phone number already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (error) {
        console.error("Signup Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// ==================== LOGIN ====================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find user by email
        const user = await User.findOne({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.JWT_SECRET || "group_chat_secret_key",
            {
                expiresIn: "1d",
            }
        );

        // Login successful
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
// ==================== CHECK USER ====================

const checkUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                exists: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({
            where: {
                email: email.trim().toLowerCase(),
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                exists: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            exists: true,
            message: "User exists",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Check User Error:", error);

        return res.status(500).json({
            success: false,
            exists: false,
            message: "Internal server error",
        });
    }
};

// ==================== EXPORT ====================

module.exports = {
    signup,
    login,
    checkUserByEmail,
};