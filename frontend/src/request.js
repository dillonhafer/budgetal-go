const base = async (url, method, headers = {}, body = {}) => {
  try {
    const _budgetal_session = localStorage.getItem('_budgetal_session') || '';
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

    const resp = await fetch(url, req);

    if (resp.status === 503) {
      window.error('YOU IN MAINT MAN');
      return;
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
    return {...json, ok: true};
  } catch (err) {
    window.error(err.error || 'Something went wrong');
  }
};

const request = {
  get: (url, headers = {}) => {
    return base(url, 'GET', headers);
  },
  post: (url, body = {}, headers = {}) => {
    return base(url, 'POST', headers, body);
  },
  delete: (url, body = {}, headers = {}) => {
    return base(url, 'DELETE', headers, body);
  },
};

export default request;
