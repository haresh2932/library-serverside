// const Users = require("../model/user.model");
// const bcrypt = require('bcrypt');

// const listUsers=async(req,res)=>{
//     try {
//         const users = await Users.find();

//         if (!users || users.length === 0) {
//             return res.status(404).json({
//                 success: false,
//                 message: "users data not found",
//             });
//         }
//         return res.status(200).json(users);
//       } catch (error) {
//         return res.status(500).send(error.message);
//       }
// }
// const registerUsers = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await Users.findOne({ $or: [{ email }] })
//         console.log(user, "jdfjd");

//         if (user) {
//             return res.status(405).json({
//                 success: false,
//                 message: "email is alrady exist",
//             });
//         }

//         const hashPassword = await bcrypt.hash(password, 10)
//         console.log(hashPassword);

//         if (!hashPassword) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Internal error in password incryption",
//             });
//         }
//         const users = await Users.create({
//             ...req.body, password: hashPassword
//             // ,avtar:req.file.path
//         })
//         console.log(users,"45");
//         if (!users) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Internal error in registration",
//             });
//         }

//         const userData = await Users.findById(users._id).select("-password")
//         // const mail = await sendmail(userData.email)
//         console.log(userData,"55");

//         return res.status(201).json({
//             success: true,
//             message: "User register successfully",
//             data: userData,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error" + error.message,
//         });
//     }
// }

// module.exports={
//     listUsers,
//     registerUsers
// }

const Users = require('../model/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 

const JWT_SECRET = 'herrybooksauth'; 


const listUsers = async (req, res) => {
    try {
        const users = await Users.find();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Users data not found",
            });
        }
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const registerUsers = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });

        if (user) {
            return res.status(405).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        if (!hashPassword) {
            return res.status(400).json({
                success: false,
                message: "Internal error in password encryption",
            });
        }

        const newUser = await Users.create({
            ...req.body,
            password: hashPassword,
        });

        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "Internal error in registration",
            });
        }

        const userData = await Users.findById(newUser._id).select("-password");

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        // Set token in cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: { _id: user._id, email: user.email },
                token,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};

const logoutUser = (req, res) => {
    try {
        res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error: " + error.message,
        });
    }
};


const authenticateUser = async (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access denied",
        });
    }

    try {
        const decoded = await jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

module.exports = {
    listUsers,
    registerUsers,
    loginUser,
    logoutUser,
    authenticateUser,
};
