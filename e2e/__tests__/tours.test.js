const request = require('../request');
const db = require('../db');
const { matchMongoId, matchMongoDate } = require('../match-helpers');

describe('tours api', () => {
  beforeEach(() => {
    return Promise.all([db.dropCollection('tours')]);
  });
  const tour = {
    title: 'Sun Country',
    activites: ['sleeping', 'swimming'],
    stops: [
      {
        attendance: 2
      }
    ]
  };

  it('posts a tour', () => {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body)
      .then(postedTour => {
        expect(postedTour).toMatchInlineSnapshot(
          {
            ...matchMongoDate,
            ...matchMongoId
          },

          `
          Object {
            "__v": 0,
            "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
            "activites": Array [
              "sleeping",
              "swimming",
            ],
            "launchDate": StringMatching /\\^\\(-\\?\\(\\?:\\[1-9\\]\\[0-9\\]\\*\\)\\?\\[0-9\\]\\{4\\}\\)-\\(1\\[0-2\\]\\|0\\[1-9\\]\\)-\\(3\\[01\\]\\|0\\[1-9\\]\\|\\[12\\]\\[0-9\\]\\)T\\(2\\[0-3\\]\\|\\[01\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\)\\(\\\\\\\\\\.\\[0-9\\]\\+\\)\\?\\(Z\\)\\?/i,
            "stops": Array [
              Object {
                "_id": "5d942dfd0cb4fc2f740cf732",
                "attendance": 2,
              },
            ],
            "title": "Sun Country",
          }
        `
        );
      });
  });
});
