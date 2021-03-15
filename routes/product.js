const { getProducts, addProducts, deleteProduct, getOneProduct, getTopProducts } = require('../controllers/productController');

const router = require('express-promise-router')()

router.route("/products")
.get(getProducts)
.post(addProducts)

router.route("/TopProducts")
.get(getTopProducts)

router.route('/products/:id')
.get(getOneProduct)
.delete(deleteProduct)



module.exports = router;