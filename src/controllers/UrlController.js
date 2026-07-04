import {createUrl,getUrlsByUserId,deleteUrlById,incrementClickCount,findUrlByShortCode} from '../models/UrlModel.js';

const createShortUrl=async(req,res)=>{
    try{
        const {original_url,expiry_days}=req.body;
        if(!original_url){
            return res.status(400).json({error:"Original URL is required"});
        }
        
        let expiry_date=null;
        if(expiry_days){
            expiry_date=new Date();
            expiry_date.setDate(expiry_date.getDate()+expiry_days);
        }
        
        const newUrl=await createUrl(original_url,req.userId,expiry_date);
        res.status(201).json({message:"URL created successfully",url:newUrl});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

const getUserUrls=async(req,res)=>{
    try{
        const urls=await getUrlsByUserId(req.userId);
        res.status(200).json({urls});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

const deleteUrl=async(req,res)=>{
    try{
        const {id}=req.params;
        const deleted=await deleteUrlById(id,req.userId);
        if(!deleted){
            return res.status(404).json({error:"URL not found"});
        }
        res.status(200).json({message:"URL deleted successfully",url:deleted});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

const redirectToUrl=async(req,res)=>{
    try{
        const {short_code}=req.params;
        const url=await incrementClickCount(short_code);
        if(!url){
            return res.status(404).json({error:"URL not found"});
        }
        if(url.expiry_date && new Date(url.expiry_date)<new Date()){
            return res.status(410).json({error:"URL has expired"});
        }
        res.redirect(url.original_url);
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

export{createShortUrl,getUserUrls,deleteUrl,redirectToUrl};