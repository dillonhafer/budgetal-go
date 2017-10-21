import {GetAuthenticationToken} from 'authentication';
import {error} from 'window';
const baseURL = process.env.BASE_URL || '';

const base = async (path, method, headers = {}, body = {}) => {
  try {
    const _budgetal_session = GetAuthenticationToken();
    let req = {
      headers: Object.assign(
        {},
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          _budgetal_session,
        },
        headers,
      ),
      credentials: 'include',
      method,
    };

    if (method !== 'GET') {
      switch (req.headers['Content-Type']) {
        case 'application/json':
          req.body = JSON.stringify(body);
          break;
        default:
          req.body = body;
      }
    }

    const resp = await fetch(baseURL + path, req);

    switch (resp.status) {
      case 503:
        error('We are performing maintenance. We should be done shortly.');
        return;
      case 500:
      case 404:
        error('Something went wrong');
        return;
      case 403:
        error('Permission Denied. This incident will be reported');
        return;
      default:
    }

    if (!resp.ok) {
      const text = await resp.text();
      const err = Object.assign({}, JSON.parse(text), {
        status: resp.status,
        ok: false,
      });
      throw err;
    }

    const json = await resp.json();
    return Object.assign({}, json, {ok: true});
  } catch (err) {
    error(err.error || 'Something went wrong');
  }
};

// Not yet required
// const _get = (path, headers = {}) => {
//   return base(path, 'GET', headers);
// };
export const _post = (path, body = {}, headers = {}) => {
  return base(path, 'POST', headers, body);
};
// Not yet required
// const _put = (path, body = {}, headers = {}) => {
//   return base(path, 'PUT', headers);
// };
export const _delete = (path, body = {}, headers = {}) => {
  return base(path, 'DELETE', headers, body);
};

export * from 'api/sessions';
