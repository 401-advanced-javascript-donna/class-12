const Stop = require('../stop');

describe('Stop model', () => {
  it('validates a stop', () => {
    const data = {
      location: {
        longitude: 45,
        latitude: -122
      },
      weather: {
        any: 'object', // will get from weather API
      }, 
      attendance: 500
    };
    const stop = new Stop(data);
    const errors = stop.validateSync();
    expect(errors).toBeUndefined();

    const json = stop.toJSON();
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
      weather: expect.any(Object),
    });
  });
});