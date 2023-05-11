\c nc_games_test


UPDATE reviews
SET votes = votes + 2
WHERE review_id = 1
RETURNING *;




