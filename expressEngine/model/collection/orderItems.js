import mongoose from 'mongoose';
const { Schema } = mongoose

const orderItems = new Schema({
    orderId: {
        type: String,
        unique:true
    },
    productId: {
        type: String,
        unique:true
    },
    unitPrice: {
        type: Number,
    },
    qunatity: {
        type: Number
    }
})

const orderItems = mongoose.model("OrderItems",orderItems)

export default orderItems;