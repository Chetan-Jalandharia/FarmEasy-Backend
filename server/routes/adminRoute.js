const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const userControl = require('../apis/users/userController')
const productCategoryController = require('../apis/productCategory/productCategoryController')
const commodityCategoryController = require('../apis/commodityCategory/commodityCategoryController')
const productControl = require('../apis/products/productController')
const commodityControl = require('../apis/commodities/commodityController')
const customerControl = require('../apis/customers/customerController')


//  Product Category Image upload in public->images->productcategory folder
// const productCategoryStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, "../../public/images/productCategory")
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
//         let imageName = "Products_" + Date.now() + path.extname(file.originalname)
//         cb(null, imageName)
//     }
// })

//  Commodity Category Image upload in public->images->commoditycategory folder
// const commodityCategoryStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, "../../public/images/commodityCategory")
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
//         let imageName = "Commodities_" + Date.now() + path.extname(file.originalname)
//         cb(null, imageName)
//     }
// })

//  Product Image upload in public->images->products folder
// const productStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // console.log(req);
//         // console.log(file);
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

const productStorage = multer.memoryStorage()
const productUpload = multer({ storage: productStorage })

const commodityStorage = multer.memoryStorage()
const commodityUpload = multer({ storage: commodityStorage })

//  Product Image upload in public->images->commodity folder
// const commodityStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath = path.join(__dirname, "../../public/images/commodity")
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

const productCategoryStorage = multer.memoryStorage()
const commodityCategoryStorage = multer.memoryStorage()

const productCategoryUpload = multer({ storage: productCategoryStorage })
const commodityCategoryUpload = multer({ storage: commodityCategoryStorage })

// const productUpload = multer({ storage: productStorage })
// const commodityUpload = multer({ storage: commodityStorage })



//  User authorization middleware
router.use(require('../middleware/authorizeToken'))


//  <--------------Admin CRUD oparations on product category---------------->
router.post('/category/add', productCategoryUpload.single("image"), productCategoryController.addCategory)
router.patch('/category/update', productCategoryUpload.single("image"), productCategoryController.updateCategory)
router.delete('/category/delete', productCategoryController.deleteCategory)
router.get('/category/show/:id', productCategoryController.showCategory)
router.get('/category/showall', productCategoryController.showAllCategory)
//  <----------------------------------------------------------------------->


//  <---------------Admin CRUD operation on products--------------------------->
router.post('/product/add', productUpload.single("image"), productControl.addProduct)
router.patch('/product/update', productUpload.single("image"), productControl.updateProduct)
router.get('/product/showall', productControl.showAllProduct)
router.get('/product/show/:id', productControl.showProduct)
router.delete('/product/delete', productControl.deleteProduct)

router.get("/product/searchProduct", productControl.searchProduct)
router.get("/product/showalladded", productControl.showAllAddedProduct)

router.get('/showallunapproveproducts', productControl.showAllUnapproveProduct)
router.get('/showrejectedproducts', productControl.showRejectedProducts)
router.post('/approveproduct', productControl.approveProduct)
router.post('/rejectproduct', productControl.rejectProduct)
//  <-----------------------------------------------------------------------> 


//  <--------------- Admin CRUD on Commodity Categories----------------------->
router.post('/commodity/category/add', commodityCategoryUpload.single("image"), commodityCategoryController.addCategory)
router.patch('/commodity/category/update', commodityCategoryUpload.single("image"), commodityCategoryController.updateCategory)
router.delete('/commodity/category/delete', commodityCategoryController.deleteCategory)
router.get('/commodity/category/show/:id', commodityCategoryController.showCategory)
router.get('/commodity/category/showall', commodityCategoryController.showAllCategory)
//  <----------------------------------------------------------------------->


//   <-----------------Admin CRUD operation on commodity-------------------------->
router.post('/commodity/add', commodityUpload.single("image"), commodityControl.addcommodity)
router.patch('/commodity/update', commodityUpload.single("image"), commodityControl.updatecommodity)
router.get('/commodity/showall', commodityControl.showAllcommodity)
router.get('/commodity/show/:id', commodityControl.showcommodity)
router.delete('/commodity/delete', commodityControl.deletecommodity)
router.delete('/commodity/deletemany', commodityControl.deleteselectedcommodity)

router.get("/commodity/searchCommodity", commodityControl.searchcommodity)
router.get("/commodity/showalladded", commodityControl.showAllAddedcommodity)

router.get('/showallunapprovecommodity', commodityControl.showAllUnapprovecommodity)
router.get('/showrejectedcommodity', commodityControl.showRejectedcommodity)
router.post('/approvecommodity', commodityControl.approvecommodity)
router.post('/rejectcommodity', commodityControl.rejectcommodity)
//  <----------------------------------------------------------------------->


//   <----------------Admin operations on customers-------------------------->
router.get('/showallcustomer', customerControl.showAllCustomer)
router.get('/showcustomer/:id', customerControl.showCustomer)
router.patch('/updatecustomer', customerControl.updateCustomerInfo)
router.delete('/deletecustomer', customerControl.deleteCustomer)
//  <----------------------------------------------------------------------->



module.exports = router;