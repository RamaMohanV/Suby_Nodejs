const express=require("express");
const dotEnv=require('dotenv');
const mongoose=require("mongoose");
const vendorRoutes=require('./routes/vendorRotes');

const bodyparser=require('body-parser');
 const firmRoutes=require('./routes/firmRoutes');

const productRoutes=require('./routes/productRoutes');
 
const path=require('path');


const app=express()
const PORT=4000;

dotEnv.config();

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected sucessfully"))
.catch((error) => console.log(error)) // Corrected to use the defined parameter


app.use(bodyparser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(PORT, ()=>{
    console.log(`server started and running at ${PORT}`)
})

app.use('/home',(req,res)=>{
    res.send("<h1>welcome to SUBY")
})