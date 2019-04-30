import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';
import server from '../server';
import inMemoryDB from './inMemoryDb';
import { Order } from '../model';

const { expect } = chai;
const should = chai.should();
chai.use(chaiHttp);
let db;
before(async () => {
  const { mongoUri } = await inMemoryDB();
  db = await mongoose.connect(mongoUri, { useCreateIndex: true, useNewUrlParser: true });
});

after(async () => {
  db.disconnect();
});

describe('Orders', () => {
  describe('Put function in api/order', () => {
    it('update order according to given data', async () => {
      const mockOrder = {
        orderNumber: 1, supplierId: '1234', unitPrice: 222, status: 'closed',
      };
      await Order.create(mockOrder);
      const result = await chai.request(server)
        .put('/api/order')
        .set({ authkey: 'successive' })
        .send({
          orderNumber: 1,
          dataToUpdate: {
            supplierId: '345',
            unitPrice: 555,
          },
        });
      result.should.have.status(200);
      result.body.should.have.property('data');
    });
    it('should show forbidden message when no authkey is provided', async () => {
      const result = await chai.request(server)
        .put('/api/order');
      result.should.have.status(403);
      result.body.should.have.property('error');
      result.body.should.have.property('message');
    });
    it('should show error on no data to update fields', async () => {
      const mockOrder = {
        orderNumber: 2, supplierId: '1234', unitPrice: 222, status: 'closed',
      };
      await Order.create(mockOrder);
      const result = await chai.request(server)
        .put('/api/order')
        .set({ authkey: 'successive' })
        .send({
          orderNumber: 2,
          dataToUpdate: {},
        });
      result.should.have.status(500);
      result.body.should.have.property('error');
    });
    it('should show error on no data to update', async () => {
      const mockOrder = {
        orderNumber: 3, supplierId: '1234', unitPrice: 222, status: 'closed',
      };
      await Order.create(mockOrder);
      const result = await chai.request(server)
        .put('/api/order')
        .set({ authkey: 'successive' })
        .send({
          orderNumber: 3,
        });
      result.should.have.status(500);
      result.body.should.have.property('error');
    });
  });
});
