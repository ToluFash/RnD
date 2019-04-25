import {
  Schema,
  model,
} from 'mongoose';

const ordersSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  orderNumber: {
    type: Number,
    required: true,
  },
  supplierId: {
    type: String,
    required: true,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  package: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },

}, {
  collection: 'orders',
  timestamp: true,
});

ordersSchema.pre('save', function preSave() {
  const order = this;
  order.id = order._id.toString();
});

const Order = model('orders', ordersSchema);

export default Order;
