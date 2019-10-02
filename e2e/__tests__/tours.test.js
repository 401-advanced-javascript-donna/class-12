jest.mock('../../lib/services/maps-api');
const request = require('../request');
const db = require('../db');
const { matchMongoId, matchMongoDate } = require('../match-helpers');
const getLocation = require('../../lib/services/maps-api');

getLocation.mockResolvedValue({
  latitude: 45,
  longitude: -122
});

describe('tours api', () => {
  beforeEach(() => {
    return db.dropCollection('tour');
  });

  const tour1 = {
    title: 'Super Fun',
    activites: ['Fun', 'More fun'],
    stops: [{ address: 97209 }]
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  it('add a tour with stops geo', () => {
    return postTour(tour1).then(tour => {
      expect(tour).toMatchInlineSnapshot(
        {
          ...matchMongoId,
          ...matchMongoDate,
          stops: [{ ...matchMongoId }]
        },

        `
        Object {
          "__v": 0,
          "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
          "activites": Array [
            "Fun",
            "More fun",
          ],
          "launchDate": StringMatching /\\^\\(-\\?\\(\\?:\\[1-9\\]\\[0-9\\]\\*\\)\\?\\[0-9\\]\\{4\\}\\)-\\(1\\[0-2\\]\\|0\\[1-9\\]\\)-\\(3\\[01\\]\\|0\\[1-9\\]\\|\\[12\\]\\[0-9\\]\\)T\\(2\\[0-3\\]\\|\\[01\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\):\\(\\[0-5\\]\\[0-9\\]\\)\\(\\\\\\\\\\.\\[0-9\\]\\+\\)\\?\\(Z\\)\\?/i,
          "stops": Array [
            Object {
              "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
              "address": "97209",
            },
          ],
          "title": "Super Fun",
        }
      `
      );
    });
  });
});
