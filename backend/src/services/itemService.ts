import Item from "../models/item.js";

const createItem = async (data : {name : string;price : number})=>{
    try{
        const item = await Item.create({
            name : data.name,
            price : data.price
        });
        return item;
    }catch(error){
        throw new Error("Error creating item");
    }
}

const getAllItems = async ()=>{
    try{
        const items = await Item.findAll();
        return items;
    }
    catch(error){
        throw new Error("Error fetching items");
    }
}

const getItemById = async(id : string)=>{
    try{
        const item = await Item.findByPk(id);
        if(!item){
            throw new Error("Item not found");
        }
        return item;
    }catch(error){
        throw new Error("Error fetching item");
    }
}

const updateItem = async(id : string,data : {name?: string;price?: number})=>{
    try{
        const item = await Item.findByPk(id);
        if(!item){
            throw new Error("Item not found");
        }
        if(data.name !== undefined){
            item.name = data.name;
        }
        if(data.price !== undefined){
            item.price = data.price;
        }
        await item.save();
        return item;
    }catch(error){
        throw new Error("Error updating item");
    }
}

const deleteItem = async(id : string)=>{
    try{
        const item = await Item.findByPk(id);
        if(!item){
            throw new Error("Item not found");
        }
        await item.destroy();
        return;
    }catch(error){
        throw new Error("Error deleting item");
    }
}

export default{
    createItem,
    getAllItems,
    getItemById,
    updateItem,
    deleteItem
};