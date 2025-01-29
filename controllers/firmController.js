const multer = require('multer');
const express = require('express');
const path = require('path');
const Vendor = require('../models/Vendor'); // Adjust the path as needed
const Firm = require('../models/Firm'); // Adjust the path as needed

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined; // Corrected syntax

    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, './uploads'); // Specify the folder where images will be stored
      },
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Set a unique filename
      }
    });

    // Initialize upload middleware
    const upload = multer({
      storage: storage,
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
      fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/; // Allowed file types
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (extname && mimetype) {
          return cb(null, true);
        } else {
          cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
        }
      }
    });

    // Serve static files
    // app.use('/uploads', express.static('uploads'));

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

     const savedFirm=await firm.save();
     vendor.firm.push(savedFirm);

     await vendor.save();


    return res.status(200).json({ message: 'Firm added successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
}


const deleteFirmById=async(req,res)=>{
  try {
    const firmId=req.params.firmId;
  const deleteFirm=await Firm.findByIdAndDelete(firmId);
  if(!deleteFirm){
    return res.status(404).json({error:'firm not found'});
  }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error:'internal server Error'});

    
  }
};

// Correctly export the function
module.exports = { addFirm: [multer().single('image'), addFirm] ,deleteFirmById};
