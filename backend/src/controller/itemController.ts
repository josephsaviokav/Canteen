import { itemService } from "../services/index.js";
import { type Request,type Response } from "express";

const createItem = async (req: Request,res: Response)=>{
    try{
        const {name,price} = req.body;

        if(!name || price === undefined){
            return res.status(400).json({
                success : false,
                error : "Name and price are required"
            });
        }

        const item = await itemService.createItem({name,price});
        res.status(201).json({
            success : true,
            message : "Item created successfully",
            data : item
        });
    }catch(error : any){
        res.status(400).json({
            success : false,
            error : error.message
        });
    }
}

const getAllItems = async (req: Request,res: Response)=>{
    try{
        const items = await itemService.getAllItems();
        res.json({
            success : true,
            data : items
        });
    }catch(error : any){
        res.status(500).json({
            success : false,
            error : error.message
        });
    }
}

const getItemById = async (req: Request,res: Response)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success : false,
                error : "Item ID is required"
            });
        }
        const item = await itemService.getItemById(id);
        res.json({
            success : true,
            data : item
        });
    }catch(error : any){
        res.status(500).json({
            success : false,
            error : error.message
        });
    }
}

const updateItem = async (req: Request,res: Response)=>{
    try{
        const {id} = req.params;
        const {name,price} = req.body;

        if(!id){
            return res.status(400).json({
                success : false,
                error : "Item ID is required"
            });
        }

        const item = await itemService.updateItem(id,{name,price});
        res.json({
            success : true,
            message : "Item updated successfully",
            data : item
        });
    }catch(error : any){
        res.status(400).json({
            success : false,
            error : error.message
        });
    }
}

const deleteItem = async (req: Request,res: Response)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                success : false,
                error : "Item ID is required"
            });
        }
        await itemService.deleteItem(id);
        res.json({
            success : true,
            message : "Item deleted successfully"
        });
    }catch(error : any){
        res.status(500).json({
            success : false,
            error : error.message
        });
    }
}

export default{
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
}