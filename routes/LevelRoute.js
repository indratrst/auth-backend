import express from "express";
import {
  getLevel,
  getLevelById,
  createLevel,
  updateLevel,
  deleteLevel
} from "../controllers/Level.js";

const router = express.Router();

router.get('/level', getLevel);
router.get('/level/:id', getLevelById);
router.post('/level', createLevel);
router.patch('/level/:id', updateLevel);
router.delete('/level/:id', deleteLevel);


export default router;