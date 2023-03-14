import Achieve from "../models/AchieveModel.js";
import path from "path";
import fs from "fs";

export const getAchieve = async(req, res)=>{
    try {
        const response = await Achieve.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getAchieveById = async(req, res)=>{
    try {
        const response = await Achieve.findOne({
            where:{
                uuid : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createAchieve = (req, res)=>{
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
            await Achieve.create({title: title,description:description, image: fileName, url: url,link: link});
            res.status(201).json({msg: "Achieve Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateAchieve = async(req, res)=>{
    const achieve = await Achieve.findOne({
        where:{
            uuid : req.params.id
        }
    });
    if(!achieve) return res.status(404).json({msg: "No Data Found"});
    
    let fileName = "";
    if(req.files === null){
        fileName = achieve.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${achieve.image}`;
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
        await Achieve.update({title: title, description:description, image: fileName, url: url, link:link},{
            where:{
                id: achieve.id
            }
        });
        res.status(200).json({msg: "Achieve Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteAchieve = async(req, res)=>{
    const achieve = await Achieve.findOne({
        where:{
            uuid : req.params.id
        }
    });
    if(!achieve) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${achieve.image}`;
        fs.unlinkSync(filepath);
        await Achieve.destroy({
            where:{
                id : achieve.id,
            }
        });
        res.status(200).json({msg: "Achieve Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}