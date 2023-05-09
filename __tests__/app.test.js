const testData = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../db/app');
const seed = require('../db/seeds/seed')
const connection = require('../db/connection')

beforeEach(() => seed(testData));

afterAll(() => {
    connection.end()
})

describe.only('GET /api', () => {
    test('get status 200 response', () => {
        return request(app).get('/api').expect(200);
    });
    test('returns JSON object', () => {
        return request(app).get('/api').expect(200).then((response)=> {
            expect(response.body.endpoints).toEqual({
                "GET /api": {
                  "description": "serves up a json representation of all the available endpoints of the api"
                },
                "GET /api/categories": {
                  "description": "serves an array of all categories",
                  "queries": [],
                  "exampleResponse": {
                    "categories": [
                      {
                        "description": "Players attempt to uncover each other's hidden role",
                        "slug": "Social deduction"
                      }
                    ]
                  }
                },
                "GET /api/reviews": {
                  "description": "serves an array of all reviews",
                  "queries": ["category", "sort_by", "order"],
                  "exampleResponse": {
                    "reviews": [
                      {
                        "title": "One Night Ultimate Werewolf",
                        "designer": "Akihisa Okui",
                        "owner": "happyamy2016",
                        "review_img_url": "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                        "category": "hidden-roles",
                        "created_at": "2018-05-30T15:59:13.341Z",
                        "votes": 0,
                        "comment_count": 6
                      }
                    ]
                  }
                }
              });
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

