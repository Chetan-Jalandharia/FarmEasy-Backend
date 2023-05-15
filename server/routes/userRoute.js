const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const userControl = require('../apis/users/userController')

const storageData = multer.memoryStorage()
const upload = multer({ storage: storageData })


router.post("/register", upload.single("image"), userControl.registerUser)

router.post("/login", userControl.Login)

router.post("/logout", userControl.Logout)

router.post("/verify", userControl.verifyUser)



module.exports = router;