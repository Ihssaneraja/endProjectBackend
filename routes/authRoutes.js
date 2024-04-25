const authControllers = require('../controllers/authControllers')

const router = require('express').Router()

router.post('/admin-login',authControllers.admin_login)

router.post('/seller-register',authControllers.seller_register)

router.post('/seller-login',authControllers.seller_login)



module.exports = router