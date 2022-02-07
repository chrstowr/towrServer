const express = require("express");
const { Ingredient } = require("../models/ingredient");
const authenticate = require("../authenticate");

const IngredientRouter = express.Router();

IngredientRouter.route("/")
  .get((req, res, next) => {
    Ingredient.find()
      .populate("ingredients")
      .populate("type")
      .populate("brand")
      .then(Ingredients => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Ingredients);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Ingredient.create(req.body)
      .then(Ingredient => {
        console.log("Ingredient Created ", Ingredient);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Ingredient);
      })
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /Ingredients");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Ingredient.deleteMany()
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

IngredientRouter.route("/:ingredientId")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Ingredient.findById(req.params.ingredientId)
      .populate("ingredients")
      .populate("type")
      .populate("brand")
      .then(Ingredient => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Ingredient);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /Ingredients/${req.params.ingredientId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Ingredient.findByIdAndUpdate(
      req.params.ingredientId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(Ingredient => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(Ingredient);
      })
      .catch(err => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Ingredient.findByIdAndDelete(req.params.ingredientId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

module.exports = IngredientRouter;
