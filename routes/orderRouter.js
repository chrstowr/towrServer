const express = require("express");
const Order = require("../models/order");

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get((req, res, next) => {
    Order.find()
      .then(orders => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(orders);
      })
      .catch(err => next(err));
  })
  .post((req, res, next) => {
    Order.create(req.body)
    .then(order => {
      console.log("Order Created ", order);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(order);
    })
    .catch(err => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /order");
  })
  .delete((req, res, next) => {
    Order.deleteMany()
    .then(response => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(response);
    })
    .catch(err => next(err));
  });

orderRouter.route("/:orderId").get().post().put().delete();

module.exports = campsiteRouter;
