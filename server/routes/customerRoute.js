const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const productControl = require('../apis/products/productController')
const productCategoryControl = require('../apis/productCategory/productCategoryController')
const commodityCategoryControl = require('../apis/commodityCategory/commodityCategoryController')
const commodityControl = require('../apis/commodities/commodityController')
const borrowControl = require('../apis/Borrow/borrowerController')
const productPurchaseControl = require('../apis/purchases/product purchase/productPurchaseController')
const commodityPurchaseControl = require('../apis/purchases/commodity purchase/commodityPurchaseController')
const customerControl = require('../apis/customers/customerController')

//  Product Image upload in public->images->products folder
// const productStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, "../../public/images/products")
//         try {
//             if (!fs.existsSync(uploadPath)) {
//                 fs.mkdirSync(uploadPath);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//         cb(null, uploadPath)
//     },
//     filename: (req, file, cb) => {
//         let imageName = "Image" + Date.now() + path.extname(file.originalname)
//         cb(null, imageName)
//     }
// })
//  Product Image upload in public->images->commodity folder
// const commodityStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, "../../public/images/commodity")
//         console.log(uploadPath);
//         try {
//             if (!fs.existsSync(uploadPath)) {
//                 fs.mkdirSync(uploadPath);
//             }
//         } catch (err) {
//             console.error(err);
//         }
//         cb(null, uploadPath)
//     },
//     filename: (req, file, cb) => {
//         let imageName = "Image" + Date.now() + path.extname(file.originalname)
//         cb(null, imageName)
//     }
// })

const productStorage = multer.memoryStorage()
const commodityStorage = multer.memoryStorage()

const productUpload = multer({ storage: productStorage })
const commodityUpload = multer({ storage: commodityStorage })


//  <-----------------public APIs----------------------->
router.get("/product/showall", productControl.showAllProduct)
router.get("/product/searchProduct", productControl.searchProduct)

router.get('/showcustomer/:id', customerControl.showCustomer)
router.get('/commodity/showall', commodityControl.showAllcommodity)
router.get('/commodity/category/showall', commodityCategoryControl.showAllCategory)
router.get('/product/category/showall', productCategoryControl.showAllCategory)

//  User authorization middleware
router.use(require('../middleware/authorizeToken'))


// <-----------------customer CRUD operations on products-------------------------->

router.post("/product/add", productUpload.single("image"), productControl.addProduct)
router.patch("/product/update", productUpload.single("image"), productControl.updateProduct)
router.get("/product/show/:id", productControl.showProduct)
router.get("/product/showalladded", productControl.showAllAddedProduct)
router.delete("/product/delete", productControl.deleteProduct)
// <---------------------------------------------------------------------------->


// <-----------------customer CRUD operations on Commodity-------------------------->

router.post("/commodity/add", commodityUpload.single("image"), commodityControl.addcommodity)
router.patch('/commodity/update', commodityUpload.single("image"), commodityControl.updatecommodity)
router.get('/commodity/show/:id', commodityControl.showcommodity)
router.delete('/commodity/delete', commodityControl.deletecommodity)


router.get("/commodity/searchCommodity", commodityControl.searchcommodity)
router.get("/commodity/showalladded", commodityControl.showAllAddedcommodity)
// <---------------------------------------------------------------------------->


// <-----------------customer Borrow operations on Product-------------------------->

router.post("/sendborrowrequest", borrowControl.sendBorrowRequest)
router.get("/showborrowrequest", borrowControl.showBorrowRequest)
router.get("/showallborrowrequest", borrowControl.showAllBorrowRequests)
router.get("/showallborrowrequestsend", borrowControl.showAllBorrowRequestSend)
router.post("/acceptborrowrequest", borrowControl.acceptBorrowRequests)
router.post("/rejectborrowrequest", borrowControl.rejectBorrowRequests)

router.get("/showlendedproducts", productControl.showLendedProducts)
router.get("/showborrowedproducts", productControl.showBorrowedProducts)
// <---------------------------------------------------------------------------->


// <-----------------customer Purchases operations on Product-------------------------->

router.post("/sendproductpurchaserequest", productPurchaseControl.sendProductPurchaseRequest)
router.get("/showproductpurchaseequest", productPurchaseControl.showProductPurchaseRequest)
router.get("/showallproductrequests", productPurchaseControl.showAllProductPurchaseRequests)
router.get("/showallpurchaseequestsend", productPurchaseControl.showAllProductPurchaseRequestsend)
router.post("/acceptproductpurchaserequest", productPurchaseControl.acceptProductPurchaseRequest)
router.post("/rejectproductpurchaserequest", productPurchaseControl.rejectProductPurchaseRequest)

router.get("/showselledproducts", productPurchaseControl.showSelledProducts)
router.get("/showbuyedproducts", productPurchaseControl.showBuyedProducts)
// <---------------------------------------------------------------------------->


// <-----------------customer Purchases operations on Commodity-------------------------->

router.post("/sendcommodityrequest", commodityPurchaseControl.sendCommodityPurchaseRequest)
router.get("/showcommodityrequest", commodityPurchaseControl.showCommodityPurchaseRequest)
router.get("/showallcommodityrequests", commodityPurchaseControl.showAllCommodityPurchaseRequests)
router.post("/acceptcommodityrequest", commodityPurchaseControl.acceptCommodityPurchaseRequests)
router.post("/rejectcommodityrequest", commodityPurchaseControl.rejectCommodityPurchaseRequests)

router.get("/showselledcommodity", commodityPurchaseControl.showSelledCommodity)
router.get("/showbuyedcommodity", commodityPurchaseControl.showBuyedCommodity)
// <---------------------------------------------------------------------------->

//   <----------------User on customers-------------------------->

router.patch('/updatecustomer', customerControl.updateCustomerInfo)
router.delete('/deletecustomer', customerControl.deleteCustomer)
//  <----------------------------------------------------------------------->

module.exports = router;