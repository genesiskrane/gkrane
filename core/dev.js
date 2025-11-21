const path = require("path");
const { spawn } = require("child_process");

const { projects } = require("../data");

const devRoot = path.join(__dirname, "..", "dev");

function runCommand(cmd, cwd, env = {}) {
  const [command, ...args] = cmd.split(" ");
  const proc = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });

  return new Promise((resolve, reject) => {
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`Command failed: ${cmd}`))
    );
  });
}

const init = async () => {
  const basePort = 3000;
  const projectPorts = projects.map((project, index) => ({
    project,
    port: basePort + index,
    path: path.join(devRoot, project),
  }));

  projectPorts.forEach(({ project, port }) => {
    console.log(`${project} will run at http://localhost:${port}`);
  });

  // Step 4: Start Vite concurrently with --port
  console.log("[SETUP] Starting all Vite servers...");
  await Promise.all(
    projectPorts.map(({ project, path, port }) =>
      runCommand(`npx vite --port ${port}`, path)
    )
  );
};

init();