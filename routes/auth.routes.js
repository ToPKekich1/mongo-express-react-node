const { Router } = require('express');
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = Router();
const User = require('../models/User');

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Incorrect email!').isEmail(),
        check(
            'password',
            'Password length has to be 6 or more symbols!'
        ).isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration data!'
                });
            }
            const { email, password } = req.body;

            const candidate = await User.findOne({ email });

            if (candidate) {
                res.status(400).json({ message: 'User is already exist!' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ email, password: hashedPassword });

            await user.save();

            res.status(201).status({ message: 'User is created.' });
        } catch (error) {
            res.status(500).json({
                message: 'Something went wrong! Try again.'
            });
        }
    }
);

// /api/auth/login
router.post('/login', async (req, res) => {
    '/register',
        [
            check('email', 'Please, enter the correct login or password!')
                .normalizeEmail()
                .isEmail(),
            check('password', 'Enter the password!').exist()
        ],
        async (req, res) => {
            try {
                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        errors: errors.array(),
                        message: 'Invalid login data!'
                    });
                }

                const { email, password } = req.body;

                const user = await User.findOne({ email });

                if (!user) {
                    return res
                        .status(400)
                        .json({ message: 'Can`t find user.' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res
                        .status(400)
                        .json({ message: 'Incorrect password! Try again.' });
                }

                const token = jwt.sign(
                    {
                        userId: user.id
                    },
                    config.get('jwtSecret'),
                    {
                        expiresIn: '1h'
                    }
                );

                res.json({ token, userId: user.id });
            } catch (error) {
                res.status(500).json({
                    message: 'Something went wrong! Try again.'
                });
            }
        };
});

module.exports = router;
