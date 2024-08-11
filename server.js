const express = require('express')
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3500
const cors = require('cors')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConfig')
const errorMiddleware = require('./middleware/error')
const cookeParser = require('cookie-parser')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookeParser());

connectDB();

app.use('/auth', require('./routes/auth'))
app.use('/api/classroom', require('./routes/classroom'))

app.use('/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Requested route doesnot exist"
    })
})

app.use(errorMiddleware);

mongoose.connection.once('open', () => {
    console.log('connected to database')
    app.listen(PORT, () => {
        console.log('Server is running at: ', PORT);
    })
})