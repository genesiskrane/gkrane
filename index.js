#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Path to your folders inside the npm package
const templateDir = path.join(__dirname, "template");
const dataDir = path.join(__dirname, "data");

// Target folder (where user runs the command)
const targetDir = process.cwd();

// Recursively copy folder
function copyFolder(src, dest) {
  // Always create destination folder
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  // If folder is empty, we're done — it is already created
  if (items.length === 0) return;

  items.forEach((item) => {
    const from = path.join(src, item);
    const to = path.join(dest, item);

    if (fs.lstatSync(from).isDirectory()) {
      copyFolder(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  });
}

console.log("Generating project...");

// 1️⃣ Copy template folder first
copyFolder(templateDir, targetDir);

// 2️⃣ Copy "data" folder into target root
const targetData = path.join(targetDir, "data");
copyFolder(dataDir, targetData);

console.log("Done!");
