const UserModel = require('../Models/user');

exports.register = async (req, res) => {
    try {
        const { name, email, photoUrl } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                error: "Name and email are required"
            });
        }

        // Check whether user already exists
        let user = await UserModel.findOne({ email });

        // If user doesn't exist, create a new one
        if (!user) {
            user = await UserModel.create({
                name,
                email,
                photoUrl
            });

            return res.status(201).json({
                message: "User registered successfully",
                user
            });
        }

        // Update user information if it changed
        user.name = name;
        user.photoUrl = photoUrl;

        await user.save();

        return res.status(200).json({
            message: "Welcome Back",
            user
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: "Server error",
            message: err.message
        });
    }
};