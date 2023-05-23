\c nc_games_test

SELECT reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.review_body, reviews.votes, reviews.designer, reviews.category, COUNT(comments.comment_id) AS comment_count
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id 
WHERE reviews.review_id = 2
GROUP BY reviews.owner, reviews.title, reviews.review_id, reviews.review_img_url, reviews.created_at, reviews.review_body, reviews.votes, designer, reviews.category;


