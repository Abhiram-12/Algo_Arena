const dotenv = require("dotenv");
const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

module.exports.login = async (req, res) => {
    try {
        //get all details
        const { email, password } = req.body;

        //check all detials exists
        if (!(email && password)) {
            return res.status(401).send("please enter all req fields!");
        }

        //search for user in db 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        //check for match of password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        //create token
        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });

        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        }

        //send token
        res.status(200).cookie("token", token, options).json({
            message: "You have succesfully logged in",
            username:user.name,
            success: true,
            token,
        })

    } catch (error) {
        console.log(error);
    }
};

module.exports.logout = async (req, res) => {
    console.log(" logout req received")
    res.clearCookie('token'); // Clear the cookie named 'token'
    res.status(200).send("Logout successful");
};