import { GetAuthenticationToken } from 'authentication';
import { error } from 'window';
const baseURL = process.env.REACT_APP_BASE_URL || '';

const base = async (path, method, headers = {}, body = {}) => {
  try {
    let req = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Budgetal-Session': GetAuthenticationToken(),
        ...headers,
      },
      credentials: 'include',
      method,
    };

    if (method !== 'GET') {
      switch (req.headers['Content-Type']) {
        case 'application/json':
          req.body = JSON.stringify(body);
          break;
        case 'multipart/form-data':
          delete req.headers['Content-Type'];
          req.body = body;
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
      const err = {
        ...JSON.parse(text),
        status: resp.status,
        ok: false,
      };
      throw err;
    }

    const json = await resp.json();
    return { ...json, ok: true };
  } catch (err) {
    error(err.error || 'Something went wrong');
  }
};

export const _get = (path, headers = {}) => {
  return base(path, 'GET', headers);
};
export const _post = (path, body = {}, headers = {}) => {
  return base(path, 'POST', headers, body);
};
export const _put = (path, body = {}, headers = {}) => {
  return base(path, 'PUT', headers, body);
};
export const _patch = (path, body = {}, headers = {}) => {
  return base(path, 'PATCH', headers, body);
};
export const _delete = (path, body = {}, headers = {}) => {
  return base(path, 'DELETE', headers, body);
};
