const fs = require("fs");
const path = require("path");

const axios = require("axios");

const { createStore, createRouter, saveRoutes } = require("../functions");

const load = async (project, type) => {
  console.log(`Loading ${type} project: ${project}`);

  try {
    const globalFiles = await axios.get(
      "https://babyclara.nw.r.appspot.com/api/userid"
    );
    const projectFiles = await axios.get(
      `https://babyclara.nw.r.appspot.com/api/userid/${project}`
    );

    const projectFolder = path.join(process.cwd(), `${type}s`, project);
    const projectSrcFolder = path.join(projectFolder, "src");
    
    // 1️⃣ Copy global files to project root
    for (const file of globalFiles.data) {
      // const { fileName, data } = file;
      // const targetPath = path.join(projectFolder, fileName);
      // const targetDir = path.dirname(targetPath);
      
      // fs.mkdirSync(targetDir, { recursive: true });
      // fs.writeFileSync(targetPath, data);
    }
    
    console.log(projectFiles.data)

    // // 2️⃣ Copy project files to project/src
    for (const file of projectFiles.data) {
      // const { fileName, data } = file;
      // const targetPath = path.join(projectSrcFolder, fileName);
      // const targetDir = path.dirname(targetPath);

      // fs.mkdirSync(targetDir, { recursive: true });
      // fs.writeFileSync(targetPath, data);
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
