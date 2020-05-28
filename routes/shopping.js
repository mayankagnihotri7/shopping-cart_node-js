let express = require('express');
let router = express.Router();

router.get('/', (req,res,next) => {
    if(!req.userId.isVerified){
        console.log("user not verified");
    //    return res.send("please verify first")
       return res.render("verifyForm",{email:req.userId.email})
    }
    console.log("inside profile router.", req.userId.isVerified);

    res.render('shopping');
    
})

module.exports = router;