const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Firm = require('../models/Firm');

const dotEnv=require("dotenv");
const { response } = require('express');
dotEnv.config();

const secretekey=process.env.WhatIsYourName


const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate inputs
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Check if the email already exists
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json({ success: false, message: 'Email is already taken.' });
    }

    // Hash the password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create a new vendor
    const newVendor = new Vendor({
      username,
      email,
      password: hashPassword,
    });

    // Save the vendor
    await newVendor.save();

    return res.status(201).json({ success: true, message: 'Vendor registered successfully.' });
 


} catch (error) {
    // Handle errors
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
  }
}

const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Check if the email exists in the database
      const vendor = await Vendor.findOne({ email });
      if (!vendor) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
      // jwt token implementation
      const token=jwt.sign({vendorId:vendor._id},secretekey,{expiresIn:"1h"})
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, vendor.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }
  
      // Successful login
      res.status(200).json({ success: 'Login successful.',token });
      console.log("this is token",token)
    } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }

  const getAllVendors = async (req, res) => {
    try {
      const vendors = await Vendor.find().populate('firm');
      res.json(vendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
      res.status(500).json({ error: 'Internal server error' });
    }


  }


  const getVendorById=async(req,res)=>{
    const vendorId=req.params.apple;
    try{
      const vendor=await Vendor.findById(vendorId).populate('firm');
      if(!vendor){
      return res.status(404).json({error:"vendor not found"});

      }
      res.status(200).json({vendor})

    }catch(error){
      console.log(error);
      res.status(500).json({eroor:"internal server error"});

    }

  }
  
  
  
  
  
 
module.exports = { vendorRegister ,vendorLogin, getAllVendors, getVendorById};
