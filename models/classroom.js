const mongoose = require('mongoose')

const classroomSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Classroom name is required"]
    },
    teacher: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    students: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        unique: true
    }],
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        startTime: {
            type: String,
            require: true,
            validate: {
                validator: function (v) {
                    return /^(?:|(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM))$/.test(v);
                },
                message: props => `${props.value} is not a valid Time!`
            }
        },
        endTime: {
            type: String,
            require: true,
            validate: {
                validator: function (v) {
                    return /^(?:|(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM))$/.test(v);
                },
                message: props => `${props.value} is not a valid Time!`
            }
        }
    }]
})

module.exports = mongoose.model('Classroom', classroomSchema);