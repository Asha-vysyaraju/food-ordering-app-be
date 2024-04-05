import { Router } from 'express';
import handler from 'express-async-handler';

import { BAD_REQUEST } from '../constants/httpStatus.js';
import { OrderModel } from '../models/order.model.js';
import { OrderStatus } from '../constants/orderStatus.js';
import { UserModel } from '../models/user.model.js';
import mongoose from "mongoose";

import auth from '../middleware/auth.js'
// const { ObjectId } = mongoose.Types;

const router = Router();
 router.use(auth);

router.post(
  '/create',
  handler(async (req, res) => {
    const order = req.body;
   console.log(order)
    //  if (order.items.length === 0) {
    //   return res.status(BAD_REQUEST).send('Cart Is Empty!');
    
    // }
    // else{
    const id= (req.user.id)
    await OrderModel.deleteOne({
      user: req.user.id,
      status: OrderStatus.NEW,
    });
   
    const newOrder = new OrderModel({ ...order, user: req.user.id });
    await newOrder.save();
    return res.send(newOrder);
    
  }
  )
);

router.put(
  '/pay',
  handler(async (req, res) => {
    const { paymentId } = req.body;
    const order = await getNewOrderForCurrentUser(req);
    if (!order) {
      res.status(BAD_REQUEST).send('Order Not Found!');
      return;
    }

    order.paymentId = paymentId;
    order.status = OrderStatus.PAYED;
    await order.save();

    // sendEmailReceipt(order);

    res.send(order._id);
  })
);

router.get(
  '/track/:orderId',
  handler(async (req, res) => {
    const { orderId } = req.params;
    const user = await UserModel.findById(req.user.id);

    const filter = {
      _id: orderId,
    };

    if (!user.isAdmin) {
      filter.user = user._id;
    }

    const order = await OrderModel.findOne(filter);

    if (!order) return res.send(UNAUTHORIZED);

    return res.send(order);
  })
);

router.get(
  '/newOrderForCurrentUser',
  handler(async (req, res) => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) return res.send(order);
    else return res.status(BAD_REQUEST).send();
  })
);




const getNewOrderForCurrentUser = async req=>

  await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatus.NEW,
  }).populate('user');

export default router;