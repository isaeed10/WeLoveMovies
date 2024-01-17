const router = require("express").Router();
const controller = require("./movies.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

const reviewsRouter = require("../reviews/reviews.router");
const theatersRouter = require("../theaters/theaters.router");

// Include nested routers
router.use("/:movieId/reviews", reviewsRouter);
router.use("/:movieId/theaters", theatersRouter);

// TODO: Add your routes here

// GET /movies/:movieId/theaters
router
  .route("/:movieId/theaters")
  .get(controller.listMovieTheaters)
  .all(methodNotAllowed);

// GET /movies/:movieId/reviews
router
  .route("/:movieId/reviews")
  .get(controller.readMovieReviews)
  .all(methodNotAllowed);

// GET /movies/:movieId/critics
router.route("/:movieId/critics").all(controller.handleCriticNotFound);

// GET /movies/:movieId
router.route("/:movieId").get(controller.read).all(methodNotAllowed);

// GET /movies
router.route("/").get(controller.list).all(methodNotAllowed);

module.exports = router;
