let express = require("express");
let router = express.Router();
let Product = require("../models/product");
let path = require("path");
let multer = require("multer");
let Cart = require("../models/cart");
let User = require("../models/user");

// Multer
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

// Show Single Product.
router.get("/:id/singleProduct", async (req, res, next) => {
  
  try {
    let product = await Product.findById(req.params.id);
    console.log(product, "product");
    res.render("singleProduct", { product });
  } catch (error) {
    return next(error);
  }

});

router.get('/singleProduct', async (req,res,next) => {
  res.render('singleProduct');
})

// Add products.
router.get("/addProduct", (req, res, next) => {
  res.render("addProduct");
});

router.post("/addProduct", upload.single("image"), async (req, res, next) => {
  
  try {
    req.body.image = req.file.filename;
    let product = await Product.create(req.body);
    res.redirect("/products/singleProduct");
  } catch (error) {
    return next(error);
  }

});

// Edit/update product.
router.get("/:id/editProduct", async (req, res, next) => {
  
  try {
    
    let product = await Product.findById(req.params.id);
    res.render("editProduct", { product });

  } catch (error) {
    return next(error);
  }

});

router.post("/:id/editProduct", async (req, res, next) => {
  
  try {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body);
    console.log(product, "editing product");
  } catch (error) {
    return next (error);
  }
  
});

// Add to cart.
router.post("/:id/singleProduct", async (req, res, next) => {
  
  try {
  
    let product = await Product.findById(req.params.id);

    console.log(product, 'using product');
    
    let cart = await Cart.findOneAndUpdate({userId: req.userId}, {$addToSet: {products:{productId: product.id}}}, {new:true});
    
    console.log(cart, "inside the add to cart.",req.userId);
    
  } catch (error) {
    return next(error);
  }

});

module.exports = router;
