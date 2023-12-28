import express from 'express';
import * as controller from '../controllers/controller.js';
import authenticateJwt from '../middleware.js';
import multer from 'multer';


const fileUpload = multer({ 
    storage:multer.diskStorage({
        destination: function(req,file,cb) {
            cb(null,'uploads')
        },
        filename: function (req,file,cb) {
            cb(null,file.fieldname+ '-'+Date.now()+'.png')
        }
    })
 });

const router = express.Router();
router.route('/signUp').post(controller.signup);
router.route('/uploadFile').post(fileUpload.single('file'),controller.uploadFile);
router.route('/signIn').post(controller.signIn);
router.route('/verify').post(controller.verifyEmail);


router.route('/admin/signup').post(controller.adminSignup);
router.route('/admin/signIn').post(controller.adminSignIn);


router.use(authenticateJwt);
router.route('/admin/getUsers').get(controller.getUsers);
router.route('/admin/download/:fileName').get(controller.downloadImage);
// router.route('/signout').post(controller.SignOut);
export default router;