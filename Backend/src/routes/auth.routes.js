const express=require('express')

const authCotroller=require('../controllers/auth.controller')

const router=express.Router()

//user auth api
router.post('/user/register',authCotroller.registerUser)
router.post('/user/login',authCotroller.loginUser)
router.get('/user/logout',authCotroller.logoutUser)

//food partner auth APIS
router.post('/food-partner/register',authCotroller.registerFoodPartner)
router.post('/food-partner/login',authCotroller.loginFoodPartner)
router.get('/food-partner/logout',authCotroller.logoutFoodPartner)

module.exports=router;