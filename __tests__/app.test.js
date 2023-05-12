const testData = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../db/app');
const seed = require('../db/seeds/seed')
const connection = require('../db/connection')
const endpoints = require('../endpoints.json')


afterAll(() => {
    connection.end()
})
describe('APP Tests', () => {

  beforeEach(() => 
  seed(testData));

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
  test("Return error 404 and message of 'no review found at this id!'", () => {
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

describe("POST /api/reviews/:review_id/comments", () => { 
  test("Get status 201 response and an object containing the newly posted comment", () => {
      const newComment = {
        username: "mallionaire",
        body: "giant Jenga is better",
      };
      return request(app)
        .post("/api/reviews/2/comments")
        .send(newComment)
        .expect(201)
        .then((response) => {
          expect(response.body.comment.comment_id).toBe(7);
          expect(response.body.comment.body).toBe("giant Jenga is better");
          expect(response.body.comment.review_id).toBe(2);
          expect(response.body.comment.author).toBe("mallionaire");
          expect(response.body.comment.votes).toBe(0);
          expect(typeof response.body.comment.created_at).toBe("string");
          });
  });
  test("Return error 404 and message of 'no review found at this id!'", () => {
   const newComment = {
        username: "mallionaire",
        body: "giant Jenga is better",
      };
  return request(app)
  .post("/api/reviews/20/comments")
        .send(newComment)
        .expect(404)
        .then((response) => {
         expect(response.body.msg).toBe('no review found at this id!')
        })
  });
  test("Return error 400 and message of 'bad request' if id is not a number", () => {
   const newComment = {
        username: "mallionaire",
        body: "giant Jenga is better",
      };
  return request(app)
  .post("/api/reviews/NotAnId/comments")
        .send(newComment)
        .expect(400)
        .then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });
  test("Return error 400 and message of 'bad request' if message body is missing properties", () => {
    const newComment = {
         username: "mallionaire",
       };
   return request(app)
   .post("/api/reviews/2/comments")
         .send(newComment)
         .expect(400)
         .then((response) => {
          expect(response.body.msg).toBe('bad request')
         })
   });
  test("Get status 201 response and an object containing the newly posted comment, ignoring extra properties", () => {
    const newComment = {
         username: "mallionaire",
         body: "giant Jenga is better",
         rating: 7
       };
   return request(app)
   .post("/api/reviews/2/comments")
         .send(newComment)
         .expect(201)
         .then((response) => {
          expect(response.body.comment.comment_id).toBe(7);
          expect(response.body.comment.body).toBe("giant Jenga is better");
          expect(response.body.comment.review_id).toBe(2);
          expect(response.body.comment.author).toBe("mallionaire");
          expect(response.body.comment.votes).toBe(0);
          expect(typeof response.body.comment.created_at).toBe("string");
          expect(response.body.comment.rating).toBe(undefined)
          });
   });
  test("Return error 400 and message of 'bad request' if message body does not have required fields of 'username' and 'body'", () => {
    const newComment = {
         name: "mallionaire",
         comment: "giant Jenga is better",
       };
   return request(app)
   .post("/api/reviews/2/comments")
         .send(newComment)
         .expect(400)
         .then((response) => {
          expect(response.body.msg).toBe('bad request')
         })
   });
  test("Return error 404 and message of 'username not recognised'", () => {
    const newComment = {
         username: "be-part",
         body: "giant Jenga is better",
       };
   return request(app)
   .post("/api/reviews/2/comments")
         .send(newComment)
         .expect(404)
         .then((response) => {
          expect(response.body.msg).toBe('username not recognised')
         })
   });
   
});

describe("PATCH /api/reviews/:review_id", () => {
  test("Get status 200 response and an object containing the updated review with votes added on", () => {
  const newVotes = {
        inc_votes: 20
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(200)
        .then((response) => {
          expect(response.body.review[0].review_id).toBe(1);
          expect(response.body.review[0].title).toBe("Agricola");
          expect(response.body.review[0].category).toBe("euro game");
          expect(response.body.review[0].designer).toBe("Uwe Rosenberg");
          expect(response.body.review[0].owner).toBe("mallionaire");
	        expect(response.body.review[0].review_body).toBe("Farmyard fun!");
          expect(typeof response.body.review[0].review_img_url).toBe("string");
	        expect(typeof response.body.review[0].created_at).toBe("string");
	        expect(response.body.review[0].votes).toBe(21);
          });
  });
 test("Get status 200 response and an object containing the updated review with votes subtracted", () => {
  const newVotes = {
        inc_votes: -1
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(200)
        .then((response) => {
          expect(response.body.review[0].review_id).toBe(1);
          expect(response.body.review[0].title).toBe("Agricola");
          expect(response.body.review[0].category).toBe("euro game");
          expect(response.body.review[0].designer).toBe("Uwe Rosenberg");
          expect(response.body.review[0].owner).toBe("mallionaire");
	        expect(response.body.review[0].review_body).toBe("Farmyard fun!");
          expect(typeof response.body.review[0].review_img_url).toBe("string");
	        expect(typeof response.body.review[0].created_at).toBe("string");
	        expect(response.body.review[0].votes).toBe(0);
          });
  });
  test("Return error 404 and message of 'no review found at this id!'", () => {
   const newVotes = {
        inc_votes: 20
      };
   return request(app)
        .patch("/api/reviews/20")
        .send(newVotes)
        .expect(404)
        .then((response) => {
         expect(response.body.msg).toBe('no review found at this id!')
        })
  });
  test("Return error 400 and message of 'bad request' if id is not a number", () => {
     const newVotes = {
        inc_votes: 20
      };
   return request(app)
        .patch("/api/reviews/NotAnId")
        .send(newVotes)
        .expect(400)
        .then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });
test("Return error 400 and message of 'bad request' if message body is missing properties", () => {
     const newVotes = {
      };
   return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(400)
        .then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });
  test("Get status 200 response and an object containing the updated review, ignoring extra properties", () => {
  const newVotes = {
        inc_votes: 1,
	      rating: 10/10
      };
      return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(200)
        .then((response) => {
          expect(response.body.review[0].review_id).toBe(1);
          expect(response.body.review[0].title).toBe("Agricola");
          expect(response.body.review[0].category).toBe("euro game");
          expect(response.body.review[0].designer).toBe("Uwe Rosenberg");
          expect(response.body.review[0].owner).toBe("mallionaire");
	        expect(response.body.review[0].review_body).toBe("Farmyard fun!");
          expect(typeof response.body.review[0].review_img_url).toBe("string");
	        expect(typeof response.body.review[0].created_at).toBe("string");
	        expect(response.body.review[0].votes).toBe(2);
	        expect(response.body.review[0].rating).toBe(undefined);
          });
    });

  test("Return error 400 and message of 'bad request' if message body does not have required fields of 'inc_votes' ", () => {
  const newVotes = {
	votes: 20
      };
   return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(400)
        .then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });

  test("Return error 400 and message of 'bad request' if the value of 'inc_votes' is not a number", () => {
  const newVotes = {
	votes: 'twenty'
      };
   return request(app)
        .patch("/api/reviews/1")
        .send(newVotes)
        .expect(400)
        .then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });
});

describe('GET /api/users', () => {
  test('Get status 200 response', () => {
      return request(app).get('/api/users').expect(200);
  });
  test('Returns all information in the users table including username, name and avatar_url', () => {
      return request(app).get('/api/users').then((response)=> {
      expect(response.body.users.length).toBe(4);
      response.body.users.forEach((user) => {
      expect.objectContaining({
            username: expect.any(String),
            user: expect.any(String),
            avatar_url: expect.any(String)
            })
          })
      });
  });
});

describe.skip('GET /api/reviews with queries', () => {
  test.only('Get a status 200 response', () => {
      return request(app).get('/api/reviews ').expect(200);
  })
  test.only('Returns all reviews if no category query is specified', () => {
      return request(app).get('/api/reviews').expect(200).then((response) => {
          expect(response.body.reviews.length).toBe(13)
          response.body.reviews.forEach((review) => {
              expect.objectContaining({
                  review_id: expect.any(Number),
                  title: expect.any(String),
                  category: expect.any(String),
                  designer: expect.any(String),
                  owner: expect.any(String),
                  comment_count: expect.any(Number),
                  review_img_url: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number)
                  })
          })
      })
  });
  test.only('Returns reviews by specified category query', () => {
      return request(app).get('/api/reviews?category=social+deduction').expect(200).then((response) => {
         expect(response.body.reviews.length).toBe(11)
          response.body.reviews.forEach((review) => {
            expect(review.category).toBe('social deduction')  
            expect.objectContaining({
                review_id: expect.any(Number),
                title: expect.any(String),
                category: expect.any(String),
                designer: expect.any(String),
                owner: expect.any(String),
                comment_count: expect.any(Number),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number)
                })
          })
    })
  });
  test.only('Returns review objects of specified category, sorted by date (desc) by default - if no sort_by or order is specificed', () => {
      return request(app).get('/api/reviews?category=social+deduction').expect(200).then((response) => {
          expect(response.body.reviews).toBeSortedBy('created_at', { descending: true})
          response.body.reviews.forEach((review) => {
                expect(review.category).toBe('social deduction') 
                expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    comment_count: expect.any(Number),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                      })
                  })
            })
  });

  test('Returns review objects sorted by date (desc) by default  - if no sort_by or order is specified', () => {
      return request(app).get('/api/reviews').expect(200).then((response) => {
          expect(response.body.reviews).toBeSortedBy('created_at', { descending: true})
    })
  });

  test('Returns review objects sorted by specified sort_by query in descending order if no order has been specified', () => {
      return request(app).get('/api/reviews?sort_by=votes').expect(200).then((response) => {
          expect(response.body.reviews).toBeSortedBy('votes', { descending: true})
    })
  });

test('Returns review objects sorted by specified sort_by query in specified ascending order ', () => {
      return request(app).get('/api/reviews?sort_by=votes&order=asc').expect(200).then((response) => {
          expect(response.body.reviews).toBeSortedBy('votes')
    })
  });
test('Returns review objects sorted by specified category query, specified sort_by query in specified order query', () => {
      return request(app).get('/api/reviews?category=social+deduction&sort_by=votes&order=asc').expect(200).then((response) => {
          expect(response.body.reviews).toBeSortedBy('votes')
          response.body.reviews.forEach((review) => {
              expect(review.category).toBe('social deduction')   
              expect.objectContaining({
                    review_id: expect.any(Number),
                    title: expect.any(String),
                    category: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    comment_count: expect.any(Number),
                    review_img_url: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number)
                      })
            })
        })
  });

test("Return error 404 and message of 'category not recognised'", () => {
   return request(app)
   .get("/api/reviews?category=notACategory")
         .expect(404)
         .then((response) => {
          expect(response.body.msg).toBe('category not recognised')
         })
   });

test("Return error 404 and message of 'sort_by not recognised'", () => {
    return request(app)
    .get("/api/reviews?sort_by=notASortBy")
          .expect(404)
          .then((response) => {
           expect(response.body.msg).toBe('sort_by not recognised')
          })
    });

test("Return error 404 and message of 'order not recognised'", () => {
      return request(app)
      .get("/api/reviews?order=notAnOrder")
            .expect(404)
            .then((response) => {
             expect(response.body.msg).toBe('order not recognised')
            })
      });

});


});


describe('APP Tests with DELETE functions', () => {

describe("DELETE /api/comments/:comment_id", () => {

  beforeAll(() => 
  seed(testData));

  test("Get status 204 response ", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
      });
  test("Get '/api/reviews/2/comments'  should return an array of two comments (instead of 3)", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
	      .then((response) => {
        expect(response.body.comments.length).toBe(2)
      });
  });
  test("Return error 404 and message of 'no comment found at this id!' if comment_id does not exist", () => {
   return request(app)
        .delete("/api/comments/20")
        .expect(404)
        .then((response) => {
         expect(response.body.msg).toBe('no comment found at this id!')
        })
  });
  test("Return error 400 and message of 'bad request' if 'comments_id' is not a number", () => {
      return request(app)
        .delete("/api/comments/NotAnId")
        .expect(400)
	.then((response) => {
         expect(response.body.msg).toBe('bad request')
        })
  });

});
});