// import packages
import express from 'express';

// import routes
import orderItemsRoute from './orderItems/route';

const app = express();

app.use('/', (req, res, next) => { // to be used to authenticate request
  const { headers } = req;
  if (headers.authkey !== "successive") {
    return res.status(403).json({
      error: true,
      message: "Forbidden",
    });
  }
  next();
})

app.use('/orderItems', orderItemsRoute);

export default app;
