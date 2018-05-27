const queryString = url => {
  const path = decodeURIComponent(url).split('?');
  if (path.length !== 2) {
    return {};
  }

  const pairs = path[1].split('&');

  let results = {};
  pairs.forEach(pair => {
    const objs = pair.split('=');
    results[objs[0]] = objs[1];
  });

  return results;
};

export default queryString;
