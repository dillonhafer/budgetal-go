import queryString from './queryString';

describe('queryString', () => {
  it('handles empty query string', () => {
    expect(queryString('http://example.com/foobar')).toEqual({});
  });

  it('finds the first item', () => {
    expect(
      queryString('http://example.com/foobar?reset_password_token=token')
        .reset_password_token,
    ).toEqual('token');
  });

  it('finds the second item', () => {
    expect(
      queryString(
        'http://example.com/foobar?email=hi@mail.com&reset_password_token=token',
      ).reset_password_token,
    ).toEqual('token');
  });

  it('handles URL encoded values', () => {
    expect(
      queryString(
        'http://example.com/foobar?email=hi%40mail.com&reset_password_token=token',
      ).email,
    ).toEqual('hi@mail.com');
  });
});
