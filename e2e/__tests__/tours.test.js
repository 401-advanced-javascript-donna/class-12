jest.mock('../../lib/services/maps-api');
jest.mock('../../lib/services/weather-api');
const request = require('../request');
const db = require('../db');
const { matchMongoId, matchMongoDate } = require('../match-helpers');
const getLocation = require('../../lib/services/maps-api');
const getWeather = require('../../lib/services/weather-api');

getLocation.mockResolvedValue({
  latitude: 45,
  longitude: -122
});

getWeather.mockResolvedValue({
  date: new Date(1570053937846 * 1000).toISOString(),
  summary: 'Mostly cloudy'
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

  const location1 = {
    name: 'Test Location 1',
    address: '97209'
  };

  function postTour(tour) {
    return request
      .post('/api/tours')
      .send(tour)
      .expect(200)
      .then(({ body }) => body);
  }

  it('add a tour', () => {
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
            },
          ],
          "title": "Super Fun",
        }
      `
      );
    });
  });

  it('gets tours', () => {
    return postTour(tour1).then(() => {
      return request.get('/api/tours').then(({ body }) => {
        expect(body[0]).toMatchInlineSnapshot(
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
              },
            ],
            "title": "Super Fun",
          }
        `
        );
      });
    });
  });

  it('adds a stop', () => {
    return postTour(tour1)
      .then(tour => {
        return request
          .post(`/api/tours/${tour._id}/stops`)
          .send(location1)
          .expect(200)
          .then(body => {
            return [body, location1, location1];
          });
      })
      .then(out => {
        const stops = out[0].body[1];
        expect(stops).toMatchInlineSnapshot(
          {
            ...matchMongoId
          },

          `
          Object {
            "_id": StringMatching /\\^\\[a-f\\\\d\\]\\{24\\}\\$/i,
            "attendance": 0,
            "location": Object {
              "latitude": 45,
              "longitude": -122,
            },
            "weather": Object {
              "date": "+051723-01-11T13:50:46.000Z",
              "summary": "Mostly cloudy",
            },
          }
        `
        );
      });
  });
});
