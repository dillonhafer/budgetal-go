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

    if (
      method !== 'GET' &&
      req.headers['Content-Type'] === 'application/json'
    ) {
      req.body = JSON.stringify(body);
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
    window.error(err.error);
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
