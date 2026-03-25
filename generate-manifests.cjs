const fs = require('fs');
const path = require('path');

const REPO_ROOT = __dirname;
const PORTFOLIO_IMAGES_DIR = path.join(REPO_ROOT, 'portfolio-images');
const GALLERY_IMAGES_DIR = path.join(REPO_ROOT, 'my-portfolio', 'src', 'assets', 'gallery');

function getFilesRecursive(dir, baseDir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const relativePath = path.relative(REPO_ROOT, filePath).replace(/\\/g, '/');

    if (stat && stat.isDirectory()) {
      results.push({
        name: file,
        type: 'dir',
        path: relativePath,
        children: getFilesRecursive(filePath, baseDir)
      });
    } else {
      // Only include images
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        results.push({
          name: file,
          type: 'file',
          path: relativePath,
          size: stat.size
        });
      }
    }
  });
  return results;
}

function getFlatFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && !stat.isDirectory()) {
      if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) {
        results.push(file);
      }
    }
  });
  return results;
}

console.log('Generating manifests...');

// 1. Repo Manifest (Recursive for portfolio-images)
const repoManifest = {
  name: 'portfolio-images',
  type: 'dir',
  path: 'portfolio-images',
  children: getFilesRecursive(PORTFOLIO_IMAGES_DIR, PORTFOLIO_IMAGES_DIR)
};
fs.writeFileSync(path.join(REPO_ROOT, 'repo-manifest.json'), JSON.stringify(repoManifest, null, 2));
console.log('✓ repo-manifest.json generated');

// 2. Gallery Manifest (Flat for src/assets/gallery)
const galleryFiles = getFlatFiles(GALLERY_IMAGES_DIR);
fs.writeFileSync(path.join(REPO_ROOT, 'gallery-manifest.json'), JSON.stringify(galleryFiles, null, 2));
console.log('✓ gallery-manifest.json generated');

console.log('Done! Please push repo-manifest.json and gallery-manifest.json to GitHub.');
