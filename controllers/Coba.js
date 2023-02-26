import Coba from "../models/CobaModel.js";
import path from "path";
import fs from "fs";

export const getCoba = async(req, res)=>{
    try {
        const response = await Coba.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getCobaById = async(req, res)=>{
    try {
        const response = await Coba.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createCoba = (req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const name = req.body.title;
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
            await Coba.create({name: name, image: fileName, url: url});
            res.status(201).json({msg: "Coba Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateCoba = async(req, res)=>{
    const Coba = await Coba.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!Coba) return res.status(404).json({msg: "No Data Found"});
    
    let fileName = "";
    if(req.files === null){
        fileName = Coba.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${Coba.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
        });
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    
    try {
        await Coba.update({name: name, image: fileName, url: url},{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Coba Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteCoba = async(req, res)=>{
    const Coba = await Coba.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!Coba) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${Coba.image}`;
        fs.unlinkSync(filepath);
        await Coba.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "Coba Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}