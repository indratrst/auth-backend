import express from "express";
import {
    getCoba,
    getCobaById,
    createCoba,
    updateCoba,
    deleteCoba
} from "../controllers/Coba.js";

const router = express.Router();

router.get('/coba', getCoba);
router.get('/coba/:id', getCobaById);
router.post('/coba', createCoba);
router.patch('/coba/:id', updateCoba);
router.delete('/coba/:id', deleteCoba);

export default router;