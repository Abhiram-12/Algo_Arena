const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Admin=require('../models/admin');
const User=require('../models/users');
dotenv.config();


// Function to check authentication
const checkAuth = async (token) => {
  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
        if (err) {
          reject({
            isAuthenticated: false,
            isAdmin: false,
            message: "Please login to continue!"
          });
        } else {
          resolve(data);
        }
      });
    });

    const user = await User.findById(decoded.id);
    if (!user) {
      throw {
        isAuthenticated: false,
        message: "User not found!"
      };
    }

    const admin = await Admin.findOne({ user_id: decoded.id });
    const isAdmin = !!admin;

    return {
      isAuthenticated: true,
      isAdmin,
      name: user.name
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};


module.exports.checkAuth = async (req, res) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({
      isAuthenticated: false,
      message: "No token found, please login!"
    });
  }

  try {
    const authStatus = await checkAuth(token);
    res.json(authStatus);
  } catch (err) {
    res.status(401).json(err);
  }
};
