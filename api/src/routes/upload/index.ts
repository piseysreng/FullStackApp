import 'dotenv/config';
import { NextFunction, Router } from 'express';
import multer from 'multer';
import { multipleUpload, singleUpload } from './uploadController.js';
import { multerHandleError } from '../../middlewares/multerHandleError.js';
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({ 
  cloud_name: 'dtyazbc83', 
  api_key: '637548466761269', 
  api_secret: 'V1Ce11apVOx3dtfLna0bZ-bsJUk',
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dev_ecommerce',
  } as any,
});

// const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 1 * 1024 * 1024 }
// });

const upload = multer({ storage });

const router = Router();
router.get('/', (req, res) => { res.send('Upload Router') });

router.post('/single', upload.single('file') ,singleUpload);
router.post('/multi', upload.array('files', 3) ,multipleUpload);
// router.post('/single', upload.single('file'), multerHandleError ,singleUpload);
// router.post('/multi', upload.array('files', 3),multerHandleError ,multipleUpload);

export default router;