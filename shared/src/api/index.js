// Dynamically load api
import { _get, _post, _put, _patch, _delete } from "../../../src/api";

[
  { name: "_get", method: _get },
  { name: "_post", method: _post },
  { name: "_put", method: _put },
  { name: "_patch", method: _patch },
  { name: "_delete", method: _delete }
].forEach(exp => {
  if (exp.method === undefined) {
    throw `Named export '${
      exp.name
    }' is not defined in your project's 'src/api/index.js' file.
    
Exception thrown from 'shared/api/index.js'
    `;
  }
});

export { _get, _post, _put, _patch, _delete };
