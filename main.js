const createWorker = (workerName) => {
  const worker = new Worker("worker.js");
  worker.addEventListener("message", (e) => {
    const result = e.data.result;
    const time = e.data.time.toFixed(2);
    console.log(`[${workerName}] result: ${result}, time: ${time}ms`);
    const problemLi = document.getElementById(`${workerName}-problem`);
    const { x, y, z } = problemLi.dataset;
    problemLi.textContent = `tarai(${x}, ${y}, ${z}) = ${result}, time: ${time}ms`;
  });
  return worker;
};

const createWorkers = (n) => {
  const workerNameList = Array.from(new Array(n), (_, i) => `worker${i}`);
  workers = workerNameList.map((name) => {
    return {
      name,
      ref: createWorker(name),
    };
  });
  return workers;
};

const createWorkerLi = (workerName) => {
  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  const createBenchData = (yMin = 0, yMax = 10) => {
    const y = getRandomInt(yMin, yMax);
    const x = 2 * y;
    const z = 0;
    return { x, y, z };
  };

  const benchData = createBenchData();
  const workerLi = document.createElement("li");
  workerLi.textContent = workerName;
  workerLi.id = workerName;

  const taraiLi = document.createElement("li");
  taraiLi.id = `${workerName}-problem`;
  taraiLi.textContent = `tarai(${benchData.x}, ${benchData.y}, ${benchData.z})`;
  taraiLi.setAttribute("data-x", benchData.x);
  taraiLi.setAttribute("data-y", benchData.y);
  taraiLi.setAttribute("data-z", benchData.z);

  const taraiUl = document.createElement("ul");
  taraiUl.appendChild(taraiLi);

  workerLi.appendChild(taraiUl);
  return workerLi;
};

const removeElChildren = (el) => {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
};

const onLoad = () => {
  let workers = [];
  const createWorkerButton = document.getElementById("create-worker");
  createWorkerButton.addEventListener("click", () => {
    workers.forEach(({ ref }) => ref.terminate());

    const numWorker = Number(document.getElementById("num-worker").value);
    workers = createWorkers(numWorker);

    const workerListUl = document.getElementById("worker-list");
    removeElChildren(workerListUl);
    workers.forEach(({ name }) => {
      workerListUl.appendChild(createWorkerLi(name));
    });

    const runWorkerButton = document.getElementById("run-worker");
    runWorkerButton.addEventListener("click", () => {
      workers.forEach((worker) => {
        const problemLi = document.getElementById(`${worker.name}-problem`);
        const { x, y, z } = problemLi.dataset;
        problemLi.textContent = `tarai(${x}, ${y}, ${z}) = ?, calculating...`;
        worker.ref.postMessage({ x, y, z });
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", onLoad);
