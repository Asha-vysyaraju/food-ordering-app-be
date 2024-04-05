import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors'
import foodRouter from './src/routers/food.router.js';
import userRouter from './src/routers/user.router.js';
import { dbconnect } from './src/config/database.config.js';
import orderRouter from './src/routers/order.router.js';

dbconnect();
const app=express();
app.use(express.json());
app.use(
    cors({
      credentials: true,
      origin:true,
    })
  );
  app.use((req,res,next)=>{
    res.set("Access-Control-Allow-Origin","*")
    next();
})

  app.use('/api/foods', foodRouter);
  app.use('/api/users', userRouter);
  app.use('/api/orders', orderRouter);
  const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log('listening on port ' + PORT);
});