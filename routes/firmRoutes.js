const  express=require('express');

const firmController=require('../controllers/firmController');

 const verifytoken=require('../middlewares/verifyToken');

const router=express.Router()
router.post('/add-firm',verifytoken,firmController.addFirm);


router.get('/uploads/:imageName',(req,res)=>{
    const imageName=req.params.imageName;
    res.headersSent('Content-Type','image/jpeg');
    res.sendFile(Path.join(_dirname,'..','uploads'.imageName));
})

router.delete('/:firmId',firmController.deleteFirmById)

module.exports=router;