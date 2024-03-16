import { MessagesModel } from "../dao/mongo/models/messages.model.js"; 

export default class MessageDB {

    async createMessage(message) {
    try{
        const newMessage = await MessagesModel.create(message);
        return newMessage;
    } catch (error) {
        throw error;
    }
    }

    async findMessages() {
    try{
        const message = await MessagesModel.find().lean();
        return message;
    } catch (error) {
        throw error;
    }
    }
};
