const user=require('../apis/users/userModel')
require('dotenv').config()
const bcrypt = require('bcrypt')

const admin={ 
    name:"chetan",
    email:process.env.ADMIN_EMAIL,
    password:bcrypt.hashSync(process.env.ADMIN_PASS,10),
    isAdmin:true,
    isVerified:true
} 

user.findOne({email:admin.email})
.then(value=>{
    if (value==null) {

        let newuser=new user(admin)
        newuser.save()
        .then(data=>{
            console.log("Admin registered successfully");
        })
        .catch(err=>{
            console.log(err);
        })
        
    }
})
.catch((err)=>{
    console.log(err);
})
