import express from 'express';
import {createShortUrl,getUserUrls,deleteUrl,redirectToUrl} from '../controllers/UrlController.js';

const router=express.Router();

router.post('/shorten',createShortUrl);
router.get('/myurls',getUserUrls);
router.delete('/:id',deleteUrl);
router.get('/:short_code',redirectToUrl);

export default router;