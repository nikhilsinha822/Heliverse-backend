const catchAsyncError = require('../middleware/catchAsyncError')
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');
const User = require('../models/user');

const verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.some((role) => req.user.role.includes(role))) {
            return next(new ErrorHandler("You are not authorized to access this route", 403))
        }
        next();
    }
}

const verifyJWT = catchAsyncError(async (req, res, next) => {
    const jwtToken = req.cookies.jwt;
    if (!jwtToken)
        return (next(new ErrorHandler("Please relogin", 401)))

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    if (!decoded)
        return (next(new ErrorHandler("Please relogin", 401)))

    const user = await User.findById(decoded.user).select('-password');
    if (!user)
        return (next(new ErrorHandler("Please relogin", 403)))

    req.user = user;
    next();
})

module.exports = { verifyJWT, verifyRole };