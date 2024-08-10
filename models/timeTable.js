const mongoose = require("mongoose")

const timeTableSchema = mongoose.Schema({
    classroom: {
        type: mongoose.Schema.ObjectId,
        ref: "Classroom",
        require: true
    },
    weekDay:{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        require: true
    },
    schedule: [{
        subject: {
            type: String,
            require: true
        },
        startTime: {
            type: String,
            require: true
        },
        endTime: {
            type: String,
            require: true
        }
    }]
})

module.exports = mongoose.model('TimeTable', timeTableSchema)