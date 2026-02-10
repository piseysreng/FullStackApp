import { NextFunction, Router } from 'express';
import multer from 'multer';
import { multipleUpload, singleUpload } from './uploadController';
import { multerHandleError } from '../../middlewares/multerHandleError';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1 * 1024 * 1024 }
});



const router = Router();
router.get('/', (req, res) => { res.send('Upload Router') });

router.post('/single', upload.single('file'), multerHandleError ,singleUpload);
router.post('/multi', upload.array('files', 3),multerHandleError ,multipleUpload);

export default router;