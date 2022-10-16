const tarai = (x, y, z) => {
  if (x <= y) return y;
  return tarai(tarai(x - 1, y, z), tarai(y - 1, z, x), tarai(z - 1, x, y));
};

const bench = ({ x, y, z }) => {
  const start = performance.now();
  const result = tarai(Number(x), Number(y), Number(z));
  const end = performance.now();
  const time = end - start;
  return { result, time };
};

self.addEventListener(
  "message",
  (e) => {
    try {
      self.postMessage(bench(e.data));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
  false
);
