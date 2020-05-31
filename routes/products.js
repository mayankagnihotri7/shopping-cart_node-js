let express = require('express');
let router = express.Router();
let Product = require('../models/product');
let path = require('path');
let multer = require('multer');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../public/images/uploads"));
},
filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
},
});

var upload = multer({ storage: storage });

// Show Single Product.
router.get("/singleProduct", async (req, res, next) => {
    let product = await Product.find({});
    console.log(product, 'product')
  res.render("singleProduct", {product});
});

// Add products.
router.get("/addProduct", (req, res, next) => {
  res.render("addProduct");
});

router.get('/:id/editProduct', async (req,res,next) => {
    let product = await Product.findById(req.params.id);
    res.render("editProduct", {product});
})

router.post('/:id/editProduct', async (req,res,next) => {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body);
    console.log(product, 'editing product');
})

router.post('/addProduct', upload.single("image"), async (req,res,next) => {

    try {
        req.body.image = req.file.filename;
        let product = await Product.create(req.body);
        res.render('/products/singleProduct', {product});
    } catch (error) {
        return next(error);
    }

})

module.exports = router;