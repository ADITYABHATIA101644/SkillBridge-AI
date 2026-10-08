import { Router } from 'express';
import mongoose from 'mongoose';
const router = Router();
router.get('/', (_req,res)=>res.json({ok:true,mongodb:mongoose.connection.readyState===1,time:new Date().toISOString()}));
export default router;
