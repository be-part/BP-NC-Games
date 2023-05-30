const connection = require("../connection");
const { checkReviewIdExists } = require("../utils/db.utils");
const { Query } = require("pg");

exports.fetchReviews = (reviewID) => {
  
    let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, reviews.review_body, reviews.category, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = ${reviewID}
    GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category;`;

    return checkReviewIdExists(reviewID)
        .then(() => {
      return connection.query(queryString);
        })
        .then((result) => {
      return result.rows[0];
        });
};

exports.fetchReviewsWithCount = (category, sort_by = "created_at", order = "DESC") => {
  const validSortQueries = [
    "title",
    "designer",
    "owner",
    "category",
    "created_at",
    "votes",
  ];

  const validCategories = [
    "social deduction",
    "children's games",
    "dexterity",
    "euro game",
  ];

  const validOrders = ["ASC", "DESC"];
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 404, msg: "invalid order" });
  }

  let queryString = `SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category, COUNT(comments.comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments
    ON reviews.review_id = comments.review_id `;

  if (!validCategories.includes(category) && category) {
    return Promise.reject({ status: 404, msg: "category not recognised" });
  } else if (category) {
    queryString += `WHERE category='${category}' `;
  }

  queryString += `GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category `;

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 404, msg: "invalid sort query" });
  } else {
    queryString += `ORDER BY ${sort_by} ${order}`;
  }

  return connection.query(queryString).then((result) => {
    return result.rows;
  });
};

exports.updateReviewVotes = (votes, reviewId) => {
  if (Object.keys(votes).length < 1) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (!votes.hasOwnProperty("inc_votes")) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  if (typeof votes.inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  const queryString = `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *`;

  const valuesToAdd = [votes.inc_votes, reviewId];

  return checkReviewIdExists(reviewId)
    .then(() => {
      return connection.query(queryString, valuesToAdd);
    })
    .then((result) => {
      return result.rows;
    });
};
