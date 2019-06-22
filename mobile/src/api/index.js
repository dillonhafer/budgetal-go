import { StatusBar, Platform } from 'react-native';
import {
  GetAuthenticationToken,
  RemoveAuthentication,
} from 'utils/authentication';
import { error } from 'notify';
import { Util } from 'expo';
import Constants from 'expo-constants';

const FETCH_TIMEOUT_MESSAGE = 'Request timed out';

// Default URL to production
let baseURL = 'https://api.budgetal.com';

// eslint-disable-next-line no-undef
if (__DEV__) {
  const expoHost = Constants.manifest.debuggerHost || '';
  const port = '3000';
  baseURL = 'http://' + expoHost.replace(/:\d+/, `:${port}`);
}

let didTimeOut = false;
const fetchWithTimeout = (url, req, FETCH_TIMEOUT = 5000) => {
  return new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
      didTimeOut = true;
      const timeoutError = { error: FETCH_TIMEOUT_MESSAGE };
      reject(timeoutError);
    }, FETCH_TIMEOUT);

    fetch(url, req)
      .then(function(response) {
        clearTimeout(timeout);
        if (!didTimeOut) {
          resolve(response);
        }
      })
      .catch(function(err) {
        // Rejection already happened with setTimeout
        if (didTimeOut) return;
        reject(err);
      })
      .finally(function() {
        didTimeOut = false;
      });
  });
};

const base = async (path, method, headers = {}, body = {}) => {
  try {
    let sessionToken = await GetAuthenticationToken();
    sessionToken = sessionToken || '';

    let req = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Budgetal-Session': sessionToken,
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

    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(true);
    }
    const resp = await fetchWithTimeout(baseURL + path, req);

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
      case 401:
        error('You are not logged in. Your session may have expired.');
        await RemoveAuthentication();
        Util.reload();
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

    const json = (await resp.json()) || {};
    return { ...json, ok: true };
  } catch (err) {
    const errorMessage = err.error || 'Something went wrong';
    error(errorMessage, 2000);
  } finally {
    if (Platform.OS === 'ios') {
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }
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
