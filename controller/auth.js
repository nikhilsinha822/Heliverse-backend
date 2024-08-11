const catchAsyncError = require('../middleware/catchAsyncError')
const User = require('../models/user')
const ErrorHandler = require('../utils/ErrorHandler');
const jwt = require('jsonwebtoken')

const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new ErrorHandler("Email or password is missing", 400));

    const user = await User.findOne({ email })

    if (!user)
        return next(new ErrorHandler("User not found", 400));

    const isValidPass = await user.comparePassword(password);
    if (!isValidPass)
        return next(new ErrorHandler("Invalid Credential", 400))

    const jwtToken = jwt.sign({ user: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    )

    res.cookie('jwt', jwtToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true,
        expires: new Date(Date.now() + 12 * 60 * 60 * 1000)
    })

    res.status(200).json({
        success: true
    })
})

module.exports = {
    login
}