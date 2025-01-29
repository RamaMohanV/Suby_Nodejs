const Firm = require('../models/Firm');
const Product = require('../models/Product');
const product=require('../models/Product');

const multer= require('multer');




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



    const addProduct = async (req, res) => {
        try {
            const { productName, price, category, bestSeller, description } = req.body;
            const image = req.file ? req.file.filename : undefined;
    
            const firmId = req.params.firmId;
            const firm = await Firm.findById(firmId);
    
            if (!firm) {
                return res.status(404).json({ error: 'No firm found' });
            }
    
            // Create a new product
            const product = new Product({
                productName,
                price,
                category,
                bestSeller,
                image,
                firm: firm._id,
            });
    
            const savedProduct = await product.save(); // Save the product instance
            firm.products.push(savedProduct._id); // Push product ID to the firm's product array
            await firm.save(); // Save the firm
    
            res.status(200).json(savedProduct);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
     const getProductByfirm=async(req,res)=>{
      try{
     const  firmId=req.params.firmId;
     const firm=await Firm.findById(firmId);
     if(!firm){
      return res.status(404).json({error:'no firm foud'});

     }
    const  restaurantName=firm.firmName;
     const products=await product.find({firm:firmId});
     res.status(200).json({restaurantName,products});

      }catch(error){
      console.log(error);
      res.status(500).json({error:'internal server error'})
      }
     }


     const deleteProductById=async(req,res)=>{
      try {
       const  productId=req.params.productId;
       const deletedProduct=await product.findByIdAndDelete(productId);
       if(!deletedProduct){
        return res.status(404).json({error:'product not found'});

       }

      } catch (error) {
        console.log(error)
        res.status(500).json({error:'internal server error'});
      }
     }
    
    module.exports = { addProduct: [upload.single('image'), addProduct] ,getProductByfirm,deleteProductById};
    