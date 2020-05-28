let express = require('express');
let router = express.Router();

router.get('/', (req,res,next) => {

    console.log('inside profile router.');

    res.render('shopping');
    
})

module.exports = router;