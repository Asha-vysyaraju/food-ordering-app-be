import { Router } from 'express';

import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.js';
const router=Router();

router.get(
    '/',
    handler(async (req, res) => {
      const foods = await FoodModel.find({});
     return res.send(foods);
    })
  );


  router.get(
    '/categories',
    handler(async (req, res) => {
      const categories = await FoodModel.aggregate([
        {
          $unwind: '$category',
        },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            count: '$count',
          },
        },
      ]).sort({ count: -1 });
  
     
  
    return  res.send(categories);
    })
  );


  router.get(
    '/search/:searchTerm',
    handler(async (req, res) => {
      const { searchTerm } = req.params;
      const searchRegex = new RegExp(searchTerm, 'i');
  
      const foods = await FoodModel.find({ name: { $regex: searchRegex } });
      return res.send(foods);
    })
  );

  router.get(
    '/category/:category',
    handler(async (req, res) => {
      const { category } = req.params;
      const foods = await FoodModel.find({ category: category });
     return res.send(foods);
    })
  );

  router.get(
    '/:foodId',
    handler(async (req, res) => {
      const { foodId } = req.params;
      const food = await FoodModel.find({id:foodId});
     return res.send(food);
    })
  );


  router.delete(
    '/:foodId',
    admin,
    handler(async (req, res) => {
      console.log(req)
      const { foodId } = req.params;
      await FoodModel.deleteOne({ _id: foodId });
      return res.send();
    })
  );

  router.post(
    '/',
    admin,
    handler(async (req, res) => {
      const { name, category, price, favorite, imageUrl, stars } =
        req.body;
  
      const food = new FoodModel({
        name,
        category,
        price,
        favorite,
        imageUrl,
        
        stars,
      });
  
      await food.save();
  
      res.send(food);
    })
  );

  router.put(
    '/',
    admin,
    handler(async (req, res) => {
      const { name, category, price, favorite, imageUrl, stars }=
        req.body;
  
      await FoodModel.updateOne(
        { _id: id },
        {
          name,
        category,
        price,
        favorite,
        imageUrl,
        
        stars,
        }
      );
  
      res.send();
    })
  );

export default router;