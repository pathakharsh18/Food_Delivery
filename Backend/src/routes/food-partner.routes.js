const express=require('express');
const router=express.Router();
const foodPartnerController=require("../controllers/food-partner.controller")
const authUserMiddleware=require("../middlewares/auth.middleware")


router.get('/:id',
    authUserMiddleware.authUserMiddleware,
    foodPartnerController.getFoodPartnerById)

module.exports=router;