import express from "express";
import {
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getProjects
} from "../controllers/Projects.js";

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;