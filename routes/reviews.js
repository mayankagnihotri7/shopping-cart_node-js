let express = require('express');
let router = express.Router();
let Review = require('../models/review');

router.get('/:id', async (req,res,next) => {
    let review = await Review.findById(req.params.id);
    console.log(review, 'inside review router');
    // res.render(`review`, {review});
})

module.exports = router;