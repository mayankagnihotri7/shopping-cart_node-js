let express = require('express');
let router = express.Router();
let Product = require('../models/product');

// Add products.
router.get("/addProduct", (req, res, next) => {
    console.log('hello');
  res.render("addProduct");
});


module.exports = router;