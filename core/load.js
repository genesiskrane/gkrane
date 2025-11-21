const fs = require("fs");
const path = require("path");

const { File } = require("../db");
const { createStore, createRouter, saveRoutes } = require("../functions");

const devPath = path.join(__dirname, "..", "dev");

const load = async (project) => {
  try {
    const globalFiles = await File.find({ projectName: "*" });
    const projectFiles = await File.find({ projectName: project });

    const projectFolder = path.join(devPath, project);
    const projectSrcFolder = path.join(projectFolder, "src");

    // 1️⃣ Copy global files to project root
    for (const file of globalFiles) {
      const { fileName, data } = file;
      const targetPath = path.join(projectFolder, fileName);
      const targetDir = path.dirname(targetPath);

      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(targetPath, data);
    }

    // 2️⃣ Copy project files to project/src
    for (const file of projectFiles) {
      const { fileName, data } = file;
      const targetPath = path.join(projectSrcFolder, fileName);
      const targetDir = path.dirname(targetPath);

      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(targetPath, data);
    }

    // 3️⃣ Create Router inside /src/router
    await saveRoutes(project);
    await createRouter(project);
    await createStore(project);
  } catch (err) {
    console.error("Failed to load files:", err);
  }
};


module.exports = load;