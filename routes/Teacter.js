const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const Teacher = require('../models/teacher');
const upload = require('../middleware/multer');
const generateTokens = require('../utils/generateToken')


// Ensure environment variables are set
if (!process.env.JWT_TOKEN_SECRET_KEY || !process.env.SALT) {
    throw new Error('Missing required environment variables: JWT_TOKEN_SECRET_KEY, SALT');
}





// Check authentication
router.post('/checkAuth', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user) {
            res.status(200).json({ status: true, user: req.user });
        } else {
            return res.status(400).json({ status: false, error: 'User not found' });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});









router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(409).json({ status: "failed", message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTeacher = await new Teacher({ email, password: hashedPassword }).save();
        const { auth_token } = await generateTokens(newTeacher);

        res.status(201).json({
            status: true,
            auth_token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "Unable to register, please try again later" });
    }
});



// Get user profile
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }
        
        const profile = req.user;
        
        res.status(200).json({ status: true, profile });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});

// Update password
router.put('/update-password', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ status: false, error: 'Both old and new passwords are required' });
        }

        const user = await Teacher.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ status: false, error: 'User not found' });
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ status: false, error: 'Old password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Update password
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ 
            status: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
});




router.post('/upload-image',  passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ status: false, error: 'No image file provided' });
            }

            const user = await Teacher.findByIdAndUpdate(
                req.user._id,
                { image: req.file.path },
                { new: true }
            );

            res.status(200).json({
                status: true,
                message: 'Image uploaded successfully',
                imagePath: user.image
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, error: 'Failed to upload image' });
        }
    }
);


router.put('/update-image',
    passport.authenticate('jwt', { session: false }),
    upload.single('image'),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ status: false, error: 'No image file provided' });
            }

            const user = await Teacher.findByIdAndUpdate(
                req.user._id,
                { image: req.file.path },
                { new: true }
            );

            res.status(200).json({
                status: true,
                message: 'Image updated successfully',
                imagePath: user.image
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, error: 'Failed to update image' });
        }
    }
);





router.delete('/delete-image',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            const user = await Teacher.findByIdAndUpdate(
                req.user._id,
                { $unset: { image: 1 } },
                { new: true }
            );

            res.status(200).json({
                status: true,
                message: 'Image deleted successfully'
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: false, error: 'Failed to delete image' });
        }
    }
);



























router.post('/getProfile', async (req, res) => {
    try {
    
        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All fields are required" });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(409).json({ status: "failed", message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);

        const newTeacher = await new Teacher({ email, password: hashedPassword }).save();
        const { auth_token } = await generateTokens(newTeacher);

        res.status(201).json({
            status: true,
            auth_token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "failed", message: "Unable to register, please try again later" });
    }
});



































module.exports = router;


