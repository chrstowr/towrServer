const express = require("express");
const Order = require("../models/order");
const authenticate = require("../authenticate");

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.find()
      .populate("items")
      .then(orders => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(orders);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.create(req.body)
      .then(order => {
        console.log("Order Created ", order);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      })
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /orders");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Order.deleteMany()
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

orderRouter
  .route("/:orderId")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findById(req.params.orderId)
      .populate("items")
      .then(order => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /orders/${req.params.orderId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findByIdAndUpdate(
      req.params.orderId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then(order => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(order);
      })
      .catch(err => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Order.findByIdAndDelete(req.params.orderId)
        .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch(err => next(err));
    }
  );

orderRouter
  .route("/:orderId/items")
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findById(req.params.orderId)
      .populate("items")
      .then(order => {
        if (order) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(order.items);
        } else {
          err = new Error(`Order ${req.params.orderId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Order.findById(req.params.orderId)
      .then(order => {
        if (order) {
          order.items.push(req.body);
          order
            .save()
            .then(order => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(order);
            })
            .catch(err => next(err));
        } else {
          err = new Error(`Order ${req.params.orderId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch(err => next(err));
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end(
      `PUT operation not supported on /orders/${req.params.orderId}/items`
    );
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Order.findById(req.params.orderId)
        .then(order => {
          if (order) {
            for (let i = order.items.length - 1; i >= 0; i--) {
              order.items.id(order.items[i]._id).remove();
            }
            order
              .save()
              .then(order => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(order);
              })
              .catch(err => next(err));
          } else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch(err => next(err));
    }
  );

module.exports = orderRouter;
