import { execSync } from "node:child_process";
import { readdirSync, copyFileSync, unlinkSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { exit } from "node:process";

/**
 * This script automates the entire model optimization pipeline.
 * It performs three main steps:
 * 1. Takes KTX2-optimized GLTF/GLB files from the ktx2 directory.
 * 2. Compresses their geometry with Draco and saves them to a new 'transformed' directory.
 * 3. Generates Svelte components for each transformed model, referencing the new path.
 * 4. Moves the generated Svelte components to the components/models directory.
 * This ensures the final Svelte components are optimized and correctly linked.
 */
const configuration = {
  sourceDir: resolve(join("static", "models", "ktx2")),
  transformedDir: resolve(join("static", "models", "transformed")),
  targetDir: resolve(join("src", "lib", "components", "models")),

  overwrite: true,
  root: "/models/transformed/",
  types: false,
  keepnames: true,
  meta: false,
  shadows: false,
  printwidth: 120,
  precision: 2,
  draco: true,
  preload: true,
  suspense: false,
  isolated: false,
  transform: {
    enabled: false,
    resolution: 4096,
    simplify: {
      enabled: false,
      weld: 0.0001,
      ratio: 0.75,
      error: 0.001,
    },
  },
};

// Ensure all necessary directories exist
mkdirSync(configuration.transformedDir, { recursive: true });
mkdirSync(configuration.targetDir, { recursive: true });

// Check if the source directory exists
if (!existsSync(configuration.sourceDir)) {
  throw new Error(`Source directory ${configuration.sourceDir} doesn't exist.`);
}

// 1. Filter for models that have not yet been transformed.
const gltfFiles = readdirSync(configuration.sourceDir).filter((file) => {
  return (
    (file.endsWith(".glb") || file.endsWith(".gltf")) &&
    !file.includes("-transformed.gltf") &&
    !file.includes("-transformed.glb")
  );
});

if (gltfFiles.length === 0) {
  console.log("No gltf or glb files found to transform.");
  exit();
}

// 2. Perform the model transformation to the 'transformed' folder.
gltfFiles.forEach((file) => {
  const sourcePath = join(configuration.sourceDir, file);
  const fileExt = file.split(".").pop();

  // Create a new filename without the -ktx or -packed suffixes
  const transformedFileName = file.replace("-ktx", "-transformed");
  const transformedPath = join(configuration.transformedDir, transformedFileName);

  try {
    // Use gltf-transform to apply Draco compression
    const gltfTransformCommand = `npx @gltf-transform/cli draco ${sourcePath} ${transformedPath}`;
    execSync(gltfTransformCommand, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error applying Draco transformation to ${file}: ${error}`);
  }
});

// 3. Generate Svelte components from the newly transformed models
const transformedGltfFiles = readdirSync(configuration.transformedDir).filter((file) => {
  return (file.endsWith(".gltf") || file.endsWith(".glb")) && !file.includes("-mobile");
});

transformedGltfFiles.forEach((file) => {
  const sourcePath = join(configuration.transformedDir, file);

  // Generate the Threlte Svelte component
  const args = [];
  if (configuration.root) args.push(`--root ${configuration.root}`);
  if (configuration.types) args.push("--types");
  if (configuration.keepnames) args.push("--keepnames");
  if (configuration.meta) args.push("--meta");
  if (configuration.shadows) args.push("--shadows");
  args.push(`--printwidth ${configuration.printwidth}`);
  args.push(`--precision ${configuration.precision}`);
  if (configuration.draco) args.push(`--draco ${configuration.draco}`);
  if (configuration.preload) args.push("--preload");
  if (configuration.suspense) args.push("--suspense");
  if (configuration.isolated) args.push("--isolated");
  if (configuration.transform.enabled) {
    args.push(`--transform`);
    args.push(`--resolution ${configuration.transform.resolution}`);
    if (configuration.transform.simplify.enabled) {
      args.push(`--simplify`);
      args.push(`--weld ${configuration.transform.simplify.weld}`);
      args.push(`--ratio ${configuration.transform.simplify.ratio}`);
      args.push(`--error ${configuration.transform.simplify.error}`);
    }
  }
  const formattedArgs = args.join(" ");

  // run the command in the transformed directory so the Svelte file is created next to the gltf
  const cmd = `npx @threlte/gltf@latest ${file} ${formattedArgs}`;
  try {
    execSync(cmd, {
      cwd: configuration.transformedDir,
      stdio: "inherit",
    });
  } catch (error) {
    console.error(`Error generating Svelte component for ${file}: ${error}`);
  }
});

// 4. Move the generated Svelte files to the components directory
const svelteFiles = readdirSync(configuration.transformedDir).filter((file) =>
  file.endsWith(".svelte"),
);

svelteFiles.forEach((file) => {
  const sourcePath = join(configuration.transformedDir, file);
  const newPath = join(configuration.targetDir, file);

  try {
    copyFileSync(sourcePath, newPath);
    unlinkSync(sourcePath);
  } catch (error) {
    console.error(`Error moving file ${sourcePath}: ${error}`);
  }
});
