const serve = require("./serve");
const load = require("./load");

const init = async () => {
  console.log("Work Station Launched");

  await load();
  await serve();
};

init();
