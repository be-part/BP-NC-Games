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
    test('get status 200 response', () => {
        return request(app).get('/api').expect(200);
    });
    test('returns object containing all of the available endpoints of the api', () => {
        return request(app).get('/api').expect(200).then((response)=> {
            expect(response.body.endpoints).toEqual(endpoints)
              
        })
    });
});

describe('GET /api/categories', () => {
    test('get status 200 response', () => {
        return request(app).get('/api/categories').expect(200);
    });
    test('returns all information in the categories table including slug and description', () => {
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

