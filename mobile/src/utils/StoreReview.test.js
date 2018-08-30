import { moreThanAWeek } from './StoreReview';

describe('moreThanAWeek', () => {
  const today = '2018-08-15';

  it('more than a week works', async () => {
    const r = moreThanAWeek(today, '2018-08-08');
    expect(r).toEqual(true);
  });

  it('less than a week works', async () => {
    const r = moreThanAWeek(today, '2018-08-09');
    expect(r).toEqual(false);
  });
});
