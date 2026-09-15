const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectToDatabase = require('../models/db');

const router = express.Router();
router.post('/register', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');

        const { name, email, password } = req.body;

        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await users.insertOne({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Registration failed'
        });
    }
});
router.post('/login', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');

        const { email, password } = req.body;

        const user = await users.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            token,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        res.status(500).json({
            message: 'Login failed'
        });
    }
});
router.put('/update', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const users = db.collection('users');

        const { email, name } = req.body;

        await users.updateOne(
            { email },
            {
                $set: { name }
            }
        );

        res.json({
            message: 'User updated successfully'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Update failed'
        });
    }
});
module.exports = router;
