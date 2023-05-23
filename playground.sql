\c nc_games_test

SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category, COUNT(comments.comment_id) AS comment_count
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.votes, designer, reviews.category ORDER BY created_at DESC;


