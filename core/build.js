const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { Storage } = require("@google-cloud/storage"); // Example: Google Cloud Storage

const { projects } = require("../data");

const build = () => {};

const devRoot = path.join(__dirname, "..", "dev"); // your /dev folder
const bucketName = process.env.GOOGLE_STORAGE_BUCKET_NAME; // replace with your bucket name
const storage = new Storage({
  keyFilename: "path/to/your-service-account.json",
});

console.log(bucketName)

async function uploadDirToBucket(localDir, bucketDir) {
  const files = fs.readdirSync(localDir);

  for (const file of files) {
    const filePath = path.join(localDir, file);
    const destPath = path.join(bucketDir, file).replace(/\\/g, "/");

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      await uploadDirToBucket(filePath, destPath);
    } else {
      await storage
        .bucket(bucketName)
        .upload(filePath, { destination: destPath });
      console.log(`Uploaded ${destPath}`);
    }
  }
}

async function buildAndUploadProject(projectPath) {
  return new Promise((resolve, reject) => {
    console.log(`Building project: ${projectPath}`);
    exec("npm run build", { cwd: projectPath }, async (err, stdout, stderr) => {
      if (err) return reject(err);
      console.log(stdout);
      if (stderr) console.error(stderr);

      const distPath = path.join(projectPath, "dist");
      if (fs.existsSync(distPath)) {
        console.log(`Uploading ${projectPath}/dist to cloud storage...`);
        await uploadDirToBucket(distPath, path.basename(projectPath));
        console.log(
          `Project ${path.basename(projectPath)} uploaded successfully.`
        );
      } else {
        console.warn(`No dist folder found in ${projectPath}`);
      }

      resolve();
    });
  });
}

async function main() {
  const projects = fs
    .readdirSync(devRoot)
    .filter((name) => fs.statSync(path.join(devRoot, name)).isDirectory());

  for (const project of projects) {
    const projectPath = path.join(devRoot, project);
    try {
      await buildAndUploadProject(projectPath);
    } catch (err) {
      console.error(`Failed for ${project}:`, err);
    }
  }

  console.log("All projects processed.");
}

module.exports = build;