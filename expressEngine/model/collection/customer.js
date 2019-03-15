import {
  Schema,
  model,
} from 'mongoose';

const customerSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
}, {collection: "customers", timestamp: true});

const CustomerModel = model('Customers', customerSchema);


export default CustomerModel;