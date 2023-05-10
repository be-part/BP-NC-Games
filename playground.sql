\c nc_games_test

SELECT reviews.title, comments.comment_id, comments.body, COUNT(comments.comment_id) AS number_of_comments
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
GROUP BY reviews.title



--, category, designer, owner, review_img_url, reviews.created_at, reviews.votes, 