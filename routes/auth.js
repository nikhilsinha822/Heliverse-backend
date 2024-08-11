const express = require('express')
const router = express.Router();
const { login, createUserPrincipal, createUserTeacher } = require('../controller/auth')
const { verifyRole, verifyJWT } = require('../middleware/auth')

router.route('/login').post(login)

router.route('/principal/user')
    .post(verifyJWT, verifyRole("Principal"),createUserPrincipal);

router.route('/teacher/user')
    .post(verifyJWT, verifyRole("Teacher"), createUserTeacher);

module.exports = router