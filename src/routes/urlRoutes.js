import express from 'express';
import {createShortUrl,getUserUrls,deleteUrl,redirectToUrl} from '../controllers/UrlController.js';
import authMiddleware from '../middlewares/auth.js';

const router=express.Router();

router.post('/shorten',authMiddleware,createShortUrl);
router.get('/myurls',authMiddleware,getUserUrls);
router.delete('/:id',authMiddleware,deleteUrl);
router.get('/:short_code',redirectToUrl);

export default router;