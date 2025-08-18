import { execSync } from "node:child_process";
import { readdirSync, mkdirSync, existsSync, unlinkSync } from "node:fs";
import { join, resolve, basename } from "node:path";
import { exit, argv } from "node:process";

const config = {
  sourceDir: resolve(join("static", "models")),
  targetDir: resolve(join("static", "models", "ktx2")),
  overwrite: true,
};

function runKtxConversion() {
  if (!existsSync(config.sourceDir)) {
    console.error(`Source directory ${config.sourceDir} does not exist. Exiting.`);
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
      console.error(`Input file ${inputFile} not found or is not a glTF/GLB model.`);
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
    console.log("No gltf or glb files found to convert. Exiting.");
    exit(0);
  }

  modelFiles.forEach((file) => {
    const sourcePath = join(config.sourceDir, file);
    const fileExt = file.split(".").pop();
    const fileName = basename(file, `.${fileExt}`);

    // Standard KTX2 conversion
    const standardFileName = `${fileName}-ktx.${fileExt}`;
    const standardFilePath = join(config.targetDir, standardFileName);
    try {
      console.log(`Converting ${file} to standard KTX2...`);
      const gltfTransformStandardCommand = `npx @gltf-transform/cli uastc ${sourcePath} ${standardFilePath}`;
      execSync(gltfTransformStandardCommand, { stdio: "inherit" });
    } catch (error) {
      console.error(`Error converting ${file} to standard KTX2: ${error.message}`);
    }

    // Mobile KTX2 conversion with halved textures
    const mobileFileName = `${fileName}-ktx-mobile.${fileExt}`;
    const mobileFilePath = join(config.targetDir, mobileFileName);
    const tempMobileFilePath = join(config.targetDir, `${fileName}-temp-mobile.${fileExt}`);

    try {
      console.log(`Processing mobile version of ${file}...`);

      const resizeCommand = `npx @gltf-transform/cli resize ${sourcePath} ${tempMobileFilePath} --width 2048 --height 2048 --filter lanczos3`;
      execSync(resizeCommand, { stdio: "inherit" });

      // Then, convert the resized model to KTX2
      const gltfTransformMobileCommand = `npx @gltf-transform/cli etc1s ${tempMobileFilePath} ${mobileFilePath}`;
      execSync(gltfTransformMobileCommand, { stdio: "inherit" });

      // Clean up the temporary file
      unlinkSync(tempMobileFilePath);
      console.log(`Successfully created ${standardFileName} and ${mobileFileName}`);
    } catch (error) {
      console.error(`Error processing mobile version of ${file}: ${error.message}`);
      if (existsSync(tempMobileFilePath)) {
        unlinkSync(tempMobileFilePath);
      }
    }
  });
}

runKtxConversion();
