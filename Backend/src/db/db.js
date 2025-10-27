const mongoose=require('mongoose');

function connectDB(){
    mongoose.connect(process.env.MONGODB_URI)
        .then(()=>{
            console.log("DB is connected")
        })
        .catch((err)=>{
            console.log("DB connection err:",err)
        })
}
module.exports=connectDB;