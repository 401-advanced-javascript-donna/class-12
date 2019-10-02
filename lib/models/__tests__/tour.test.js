const Tour = require('../tour');


describe('Tour model', () => {
  it('validates a tour model', () => {
    const data = {
      title: 'Sun Country',
      activites: ['sleeping', 'swimming'],
      launchDate: new Date(),
      stops: [{
        // stop: new ObjectId(),
        location: 'Portland',
        weather: {},
        attendance: 2
      }]
    };
    const tour = new Tour(data);
    const errors = tour.validateSync();
    expect(errors).toBeUndefined();

    const json = tour.toJSON();
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
      stops: [{ _id: expect.any(Object), attendance: 2 }]
    });
  });
});