import { execSync } from "node:child_process";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { exit, argv } from "node:process";

const config = {
  sourceDir: resolve(join("static", "models")),
  targetDir: resolve(join("static", "models", "ktx2")),
  overwrite: true,
};

function runKtxConversion() {
  if (!existsSync(config.sourceDir)) {
    exit(1);
  }

  if (!existsSync(config.targetDir)) {
    mkdirSync(config.targetDir, { recursive: true });
  }

  const inputFile = argv[2];
  let modelFiles = [];

  if (inputFile) {
    const filePath = join(config.sourceDir, inputFile);
    const ext = inputFile.split(".").pop().toLowerCase();
    const isModel = ext === "gltf" || ext === "glb";
    if (existsSync(filePath) && isModel) {
      modelFiles.push(inputFile);
    } else {
      exit(1);
    }
  } else {
    modelFiles = readdirSync(config.sourceDir).filter((file) => {
      const ext = file.split(".").pop().toLowerCase();
      const isModel = ext === "gltf" || ext === "glb";
      const isOriginal = file.includes("-original");
      const isKtx2 = file.includes("-ktx");
      return isModel && !isOriginal && !isKtx2;
    });
  }

  if (modelFiles.length === 0) {
    exit(0);
  }

  modelFiles.forEach((file) => {
    const sourcePath = join(config.sourceDir, file);
    const fileExt = file.split(".").pop();
    const fileName = basename(file, `.${fileExt}`);

    const newFileName = `${fileName}-ktx.${fileExt}`;
    const newFilePath = join(config.targetDir, newFileName);

    try {
      const gltfTransformCommand = `npx @gltf-transform/cli uastc ${sourcePath} ${newFilePath}`;
      execSync(gltfTransformCommand, { stdio: "inherit" });
    } catch (error) {}
  });
}

runKtxConversion();
