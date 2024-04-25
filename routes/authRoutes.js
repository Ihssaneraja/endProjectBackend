const authControllers = require('../controllers/authControllers')
const { authMiddleware } = require('../middlewares/authMiddleware')

const router = require('express').Router()

router.post('/admin-login',authControllers.admin_login)

<<<<<<< HEAD
router.get('/get-user',authMiddleware, authControllers.getUser)
=======
router.post('/seller-register',authControllers.seller_register)

router.post('/seller-login',authControllers.seller_login)


>>>>>>> d4dd62a93735b3279b6dfba5ed04dbb5645306bd

module.exports = router