const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


async function registerUser(req, res) {
    try {
        const { email, password, fullname = {} } = req.body;
        const { firstname, lastname } = fullname;

        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const isUserAlreadyRegistered = await userModel.findOne({ email });
        if (isUserAlreadyRegistered) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: user._id, fullname: user.fullname, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

        res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, fullname: user.fullname, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
}


module.exports={registerUser,loginUser} ;