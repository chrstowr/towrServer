const express = require("express");
const { FoodItem } = require("../models/foodItem");
const authenticate = require("../authenticate");

const FoodItemRouter = express.Router();

FoodItemRouter.route("/")
  .get((req, res, next) => {
    FoodItem.find()
      .populate("ingredients")
      .populate("type")
      .populate("brand")
      .then(FoodItems => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodItems);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    FoodItem.create(req.body)
      .then(FoodItem => {
        console.log("FoodItem Created ", FoodItem);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodItem);
      })
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /FoodItems");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodItem.deleteMany()
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/:foodItemId")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .populate("ingredients")
      .populate("type")
      .populate("brand")
      .then(FoodItem => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodItem);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /FoodItems/${req.params.foodItemId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    FoodItem.findByIdAndUpdate(
      req.params.foodItemId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(FoodItem => {
        console.log(`findByIdAndUpdate: ${FoodItem}`);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodItem);
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodItem.findByIdAndDelete(req.params.foodItemId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/:foodItemId/ingredients")
  .get((req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .populate("ingredients")
      .then(FoodItem => {
        if (FoodItem) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(FoodItem.ingredients);
        } else {
          err = new Error(`FoodItem ${req.params.foodItemId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .then(FoodItem => {
        if (FoodItem) {
          FoodItem.ingredients.push(req.body);
          FoodItem.save()
            .then(FoodItem => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(FoodItem);
            })
            .catch(err => next(err));
        } else {
          err = new Error(`FoodItem ${req.params.foodItemId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /foodItems/${req.params
        .foodItemId}/ingredients`
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodItem.findById(req.params.foodItemId)
        .then(foodItem => {
          if (foodItem) {
            for (let i = foodItem.ingredients.length - 1; i >= 0; i--) {
              foodItem.ingredients.id(foodItem.ingredients[i]._id).remove();
            }
            foodItem
              .save()
              .then(foodItem => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(foodItem);
              })
              .catch(err => next(err));
          } else {
            err = new Error(`FoodItem ${req.params.foodItemId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch(err => next(err));
    }
  );

foodItemRouter
  .route("/:foodItemId/ingredients/:ingredientId")
  .get((req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .populate("ingredients")
      .then(foodItem => {
        if (foodItem && foodItem.ingredients.id(req.params.ingredientId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(foodItem.ingredients.id(req.params.ingredientId));
        } else if (!foodItem) {
          err = new Error(`FoodItem ${req.params.foodItemId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.ingredientId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /foodItems/${req.params
        .foodItemId}/ingredients/${req.params.ingredientId}`
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /foodItems/${req.params
        .foodItemId}/ingredients/${req.params.ingredientId}`
    );
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .then(foodItem => {
        if (foodItem && foodItem.ingredients.id(req.params.ingredientId)) {
          foodItem.ingredients.id(req.params.ingredientId).remove();
          foodItem
            .save()
            .then(foodItem => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(foodItem);
            })
            .catch(err => next(err));
        } else if (!foodItem) {
          err = new Error(`FoodItem ${req.params.foodItemId} not found`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.ingredientId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  });

module.exports = FoodItemRouter;
