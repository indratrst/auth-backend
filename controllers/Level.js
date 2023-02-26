import level from "../models/LevelModel.js";

export const getLevel = async(req, res)=>{
    try {
        const response = await level.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getLevelById = async(req, res)=>{
    try {
        const response = await level.findOne({
            where:{
                id : req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const createLevel = async (req, res)=>{
  try {
    await level.create(req.body);
    res.status(201).json({ msg: "Add Level Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }

}

export const updateLevel = async (req, res)=>{
    // const level = await level.findOne({
    //     where:{
    //         id : req.params.id
    //     }
    // });
    // const level = req.body.title;
    try {
        await level.update(req.body,{
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "level Updated Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteLevel = async (req, res)=>{
    // const level = await level.findOne({
    //     where:{
    //         id : req.params.id
    //     }
    // });
    // if(!level) return res.status(404).json({msg: "No Data Found"});

    try {
        await level.destroy({
            where:{
                id : req.params.id
            }
        });
        res.status(200).json({msg: "level Deleted Successfuly"});
    } catch (error) {
        console.log(error.message);
    }
}