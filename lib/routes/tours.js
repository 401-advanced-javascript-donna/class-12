// eslint-disable-next-line new-cap
const router = require('express').Router();
const Tour = require('../models/tour');
// eslint-disable-next-line no-unused-vars
const addGeo = require('../middleware/add-geolocation');
const addWeather = require('../middleware/add-weather');

router
  .get('/', (req, res, next) => {
    Tour.find()
      .lean()
      .then(tours => res.json(tours))
      .catch(next);
  })
  .post('/', (req, res, next) => {
    Tour.create(req.body)
      .then(tour => res.json(tour))
      .catch(next);
  })
  .post('/:id/stops', addGeo(), addWeather(), (req, res, next) => {
    Tour.addStop(req.params.id, req.body.location, req.body.weather)
      .then(tour => res.json(tour))
      .catch(next);
  })
  .delete('/:id/stops/:stopId', (req, res, next) => {
    Tour.removeStop(req.params.id, req.params.stopId)
      .then(stop => res.json(stop))
      .catch(next);
  })
  .put('/:id/stops/:stopId/attendance', ({ params, body }, res, next) => {
    Tour.updateStopAttendance(params.id, params.stopId, body.attendance)
      .then(stop => res.json(stop))
      .catch(next);
  });
  

module.exports = router;