const testData = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../db/app');
const seed = require('../db/seeds/seed')
const connection = require('../db/connection')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData));

afterAll(() => {
    connection.end()
})

describe('GET /api', () => {
    test('Get status 200 response', () => {
        return request(app).get('/api').expect(200);
    });
    test('Returns object containing all of the available endpoints of the api', () => {
        return request(app).get('/api').expect(200).then((response)=> {
            expect(response.body.endpoints).toEqual(endpoints)
              
        })
    });
});

describe('GET /api/categories', () => {
    test('Get status 200 response', () => {
        return request(app).get('/api/categories').expect(200);
    });
    test('Returns all information in the categories table including slug and description', () => {
        return request(app).get('/api/categories').expect(200).then((response)=> {
            expect(response.body.categories.length).toBe(4);
            response.body.categories.forEach((category)=> {
                expect(typeof category.slug).toBe('string');
                expect(typeof category.description).toBe('string')
            });
        })
    });
});

describe('GET /api/reviews/:review_id', () => {
  test("Get status 200 response", () => {
    return request(app).get("/api/reviews/1").expect(200);
  });
  test("Get review object corresponding to review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
          expect(response.body.review.review_id).toBe(1);
          expect(typeof response.body.review.title).toBe("string");
          expect(typeof response.body.review.review_body).toBe("string");
          expect(typeof response.body.review.designer).toBe("string");
          expect(typeof response.body.review.review_img_url).toBe("string");
	        expect(typeof response.body.review.votes).toBe("number");
	        expect(typeof response.body.review.category).toBe("string");
	        expect(typeof response.body.review.owner).toBe("string");
	        expect(typeof response.body.review.created_at).toBe("string");
      });
  });
  test("Return error 404 and message of 'that id does not exist!'", () => {
    return request(app)
      .get('/api/reviews/20')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('no review found at this id!')
      })
  });
  test("Return error 400 and a message of 'bad request'", () => {
    return request(app)
      .get('/api/reviews/notAnID')
      .expect(400)
      .then((response) => {
      expect(response.body.msg).toBe('bad request')
      })
  })

});

describe('GET /api/reviews', () => {
  test('Get status 200 response', () => {
    return request(app)
    .get('/api/reviews')
    .expect(200);
  });
  test('Return an array of review objects with correct properties', () => {
    return request(app)
    .get('/api/reviews')
    .expect(200)
    .then((response) => {
      expect(response.body.reviews.length).toBe(13)
      response.body.reviews.forEach((review)=> {
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
	        expect(typeof review.review_img_url).toBe("string");
	        expect(typeof review.created_at).toBe("string");
	        expect(typeof review.votes).toBe("number");
	        expect(typeof review.designer).toBe("string");
          expect(typeof review.comment_count).toBe("string");
      })
    })
  });
  test('Return array of review objects sorted by date in descending order', () => {
    return request(app)
    .get('/api/reviews')
    .expect(200)
    .then((response) => {
      expect(response.body.reviews).toBeSortedBy('created_at', { descending: true})
    })
  });
})

describe('GET /api/reviews/:review_id/comments', () => {
  test("Get status 200 response", () => {
    return request(app).get("/api/reviews/3/comments").expect(200);
  });
  test("Returns array containing comments objects that correspond to the review_id", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(3)
        response.body.comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
	        expect(comment.review_id).toBe(3);
        })
      });
  });
  test("Returns empty array if review_id does not contain any comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(0)
      });
  });
  test("Comments are sorted by date with most recent first", () => {
    return request(app)
      .get('/api/reviews/3/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy('created_at', {descending: true});})
  });
  test("Return error 404 and message of 'no review found at this id!", () => {
    return request(app)
      .get('/api/reviews/20/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('no review found at this id!')
      })
  });
  test("Return error 400 and a message of 'bad request'", () => {
    return request(app)
      .get('/api/reviews/notAnID/comments')
      .expect(400)
      .then((response) => {
      expect(response.body.msg).toBe('bad request')
      })
  });
});