import { Router } from 'express';

import { FoodModel } from '../models/food.model.js';
import handler from 'express-async-handler';
const router=Router();

router.get(
    '/',
    handler(async (req, res) => {
      const foods = await FoodModel.find({});
      res.send(foods);
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
  
     
  
      res.send(categories);
    })
  );


  router.get(
    '/search/:searchTerm',
    handler(async (req, res) => {
      const { searchTerm } = req.params;
      const searchRegex = new RegExp(searchTerm, 'i');
  
      const foods = await FoodModel.find({ name: { $regex: searchRegex } });
      res.send(foods);
    })
  );

  router.get(
    '/category/:category',
    handler(async (req, res) => {
      const { category } = req.params;
      const foods = await FoodModel.find({ category: category });
      res.send(foods);
    })
  );

  router.get(
    '/:foodId',
    handler(async (req, res) => {
      const { foodId } = req.params;
      const food = await FoodModel.find({id:foodId});
      res.send(food);
    })
  );

export default router;