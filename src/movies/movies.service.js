const db = require("../db/connection");

async function list(is_showing) {
  return db("movies")
    .select("movies.*")
    .modify((queryBuilder) => {
      if (is_showing) {
        queryBuilder
          .join(
            "movies_theaters",
            "movies.movie_id",
            "movies_theaters.movie_id"
          )
          .where({ "movies_theaters.is_showing": true })
          .groupBy("movies.movie_id");
      }
    });
}

async function read(movie_id) {
  // TODO: Add your code here
  return db("movies").where({ movie_id }).first();
}

async function readMovieReviews(movie_id) {
  return db("reviews as r")
    .select(
      "r.review_id",
      "r.content",
      "r.score",
      "r.created_at",
      "r.updated_at",
      "r.critic_id",
      "r.movie_id",
      { critic_id: "c.critic_id" },
      { preferred_name: "c.preferred_name" },
      { surname: "c.surname" },
      { organization_name: "c.organization_name" },
      { critic_created_at: "c.created_at" },
      { critic_updated_at: "c.updated_at" }
    )
    .where({ "r.movie_id": movie_id })
    .join("critics as c", "r.critic_id", "c.critic_id")
    .then((reviews) => {
      // Map the results to format the critic field as an object within each review
      return reviews.map((review) => ({
        ...review,
        critic: {
          critic_id: review.critic_id,
          preferred_name: review.preferred_name,
          surname: review.surname,
          organization_name: review.organization_name,
          created_at: review.critic_created_at,
          updated_at: review.critic_updated_at,
        },
      }));
    });
}

async function listMovieTheaters(movie_id) {
  return db("theaters as t")
    .select(
      "t.theater_id",
      "t.name",
      "t.address_line_1",
      "t.address_line_2",
      "t.city",
      "t.state",
      "t.zip",
      "t.created_at",
      "t.updated_at",
      "mt.is_showing",
      "mt.movie_id"
    )
    .join("movies_theaters as mt", "t.theater_id", "mt.theater_id")
    .where({ "mt.movie_id": movie_id, "mt.is_showing": true });
}

module.exports = {
  list,
  read,
  readMovieReviews,
  listMovieTheaters,
};
