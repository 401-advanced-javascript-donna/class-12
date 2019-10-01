const Tour = require('../tour');

describe('Tour model', () => {
  it('validates a tour model', () => {
    const data = {
      title: 'Sun Country',
      activites: ['sleeping', 'swimming'],
      launchDate: Date(),
      stops: []
    };
    const tour = new Tour(data);
    const errors = tour.validateSync();
    expect(errors).toBeUndefined();

    const json = tour.toJSON();
    expect(json).toEqual({
      ...data,
      _id: expect.any(Object),
      title: expect.any(String),
      launchDate: expect.any(Date)
    });
  });
});