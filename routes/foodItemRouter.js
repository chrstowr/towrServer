const express = require("express");
const { FoodItem, FoodBrand, FoodType } = require("../models/foodItem");
const authenticate = require("../authenticate");
const cors = require("./cors");

const FoodItemRouter = express.Router();

FoodItemRouter.route("/brands")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodBrand.find()
      .then(foodbrands => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(foodbrands);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodBrand.create(req.body)
        .then(foodbrand => {
          console.log("FoodBrand Created ", FoodBrand);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(foodbrand);
        })
        .catch(err => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /brands/");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodBrand.deleteMany()
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/brands/:brandId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodBrand.findById(req.params.brandId)
      .then(FoodBrand => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodBrand);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on fooditems/brands/${req.params.brandId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodBrand.findByIdAndUpdate(
        req.params.brandId,
        {
          $set: req.body
        },
        { new: true }
      )
        .then(foodbrand => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(foodbrand);
        })
        .catch(err => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodBrand.findByIdAndDelete(req.params.brandId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/types")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodType.find()
      .then(FoodTypes => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodTypes);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodType.create(req.body)
        .then(foodtype => {
          console.log("foodtype Created ", FoodType);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(foodtype);
        })
        .catch(err => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /fooditems/brands");
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodType.deleteMany()
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/types/:typeId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodType.findById(req.params.typeId)
      .then(foodtype => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(foodtype);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /fooditems/types/${req.params.typeId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodType.findByIdAndUpdate(
        req.params.typeId,
        {
          $set: req.body
        },
        { new: true }
      )
        .then(foodtype => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(foodtype);
        })
        .catch(err => next(err));
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodType.findByIdAndDelete(req.params.typeId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

FoodItemRouter.route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodItem.find()
      .populate("ingredients")
      .populate("types")
      .populate("brand")
      .then(FoodItems => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(FoodItems);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      FoodItem.create(req.body)
        .then(FoodItem => {
          console.log("FoodItem Created ", FoodItem);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(FoodItem);
        })
        .catch(err => next(err));
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on /FoodItems");
    }
  )
  .delete(
    cors.corsWithOptions,
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
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    FoodItem.findById(req.params.foodItemId)
      .populate("ingredients")
      .populate("type")
      .populate("brand")
      .then(fooditem => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(fooditem);
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /FoodItems/${req.params.foodItemId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .delete(
    cors.corsWithOptions,
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
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
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
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /foodItems/${req.params
          .foodItemId}/ingredients`
      );
    }
  )
  .delete(
    cors.corsWithOptions,
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

FoodItemRouter.route("/:foodItemId/ingredients/:ingredientId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
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
          err = new Error(`FoodItem ${req.params.ingredientId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /foodItems/${req.params
          .foodItemId}/ingredients/${req.params.ingredientId}`
      );
    }
  )
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end(
        `PUT operation not supported on /foodItems/${req.params
          .foodItemId}/ingredients/${req.params.ingredientId}`
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  );

module.exports = FoodItemRouter;
