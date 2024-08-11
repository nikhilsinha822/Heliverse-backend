const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email feild is missing"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password feild is missing"]
    },
    role: {
        type: String,
        default: 'Student',
        enum: ['Student', 'Principal', 'Teacher'],
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema);