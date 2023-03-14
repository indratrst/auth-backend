import express from "express";
import {
    getAchieveById,
    createAchieve,
    updateAchieve,
    deleteAchieve,
    getAchieve
} from "../controllers/Achieve.js";

const router = express.Router();

router.get('/achieve', getAchieve);
router.get('/achieve/:id', getAchieveById);
router.post('/achieve', createAchieve);
router.patch('/achieve/:id', updateAchieve);
router.delete('/achieve/:id', deleteAchieve);

export default router;