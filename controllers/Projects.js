import Project from "../models/ProjectModel.js";
import path from "path";
import fs from "fs";

export const getProjects = async(req, res)=>{
    try {
        const response = await Project.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getProjectById = async(req, res)=>{
    try {
        const response = await Project.findOne({
            where:{
                uuid : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createProject = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const title = req.body.title;
    const description = req.body.description;
    const link = req.body.link;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Project.create({title: title,description:description, image: fileName, url: url,link: link});
            res.status(201).json({msg: "Project Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateProject = async(req, res)=>{
    const project = await Project.findOne({
        where:{
            uuid : req.params.id
        }
    });
    if(!project) return res.status(404).json({msg: "No Data Found"});
    
    let fileName = "";
    if(req.files === null){
        fileName = project.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${project.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const title = req.body.title;
    const description = req.body.description;
    const link = req.body.link;

    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    
    try {
        await Project.update({title: title, description:description, image: fileName, url: url, link:link},{
            where:{
                id: project.id
            }
        });
        res.status(200).json({msg: "Project Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProject = async(req, res)=>{
    const project = await Project.findOne({
        where:{
            uuid : req.params.id
        }
    });
    if(!project) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${project.image}`;
        fs.unlinkSync(filepath);
        await Project.destroy({
            where:{
                id : project.id,
            }
        });
        res.status(200).json({msg: "Project Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}