const mongoose = require('mongoose')

const classroomSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    teacher:{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    students:[{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    schedule:[{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            require: true
        },
        startTime:{
            type: String,
            require: true
        },
        endTime:{
            type: String,
            require: true
        }
    }]
})

module.exports = mongoose.model('Classroom', classroomSchema);