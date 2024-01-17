const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  // TODO: Add your code here.
  const { movieId } = request.params;
  const movie = await service.read(Number(movieId));

  if (movie) {
    response.locals.movie = movie;
    return next();
  } else {
    next({ status: 404, message: "Movie cannot be found." });
  }
}

async function read(request, response) {
  // TODO: Add your code here
  const movie = response.locals.movie;
  response.json({ data: movie });
}

async function list(request, response) {
  // TODO: Add your code here.

  const { is_showing } = request.query;
  let movies;

  if (is_showing === "true") {
    movies = await service.list(true);
  } else {
    movies = await service.list();
  }

  response.json({ data: movies });
}

async function readMovieReviews(request, response, next) {
  const { movieId } = request.params;
  const reviews = await service.readMovieReviews(Number(movieId));
  response.json({ data: reviews });
}

async function listMovieTheaters(request, response) {
  const { movieId } = request.params;
  const theaters = await service.listMovieTheaters(Number(movieId));
  response.json({ data: theaters });
}

async function handleCriticNotFound(request, response, next) {
  next({ status: 404, message: "Not the right path to get movie critics" });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
  readMovieReviews: [asyncErrorBoundary(movieExists), readMovieReviews],
  listMovieTheaters: [asyncErrorBoundary(movieExists), listMovieTheaters],
  handleCriticNotFound,
};
