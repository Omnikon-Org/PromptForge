const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, 'packages');
const packages = fs.readdirSync(packagesDir);

for (const pkg of packages) {
  if (pkg === 'core') continue; // Skip core

  const pkgPath = path.join(packagesDir, pkg, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkgData = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

    // Add private flag if not present
    if (!pkgData.private) {
      // Reconstruct object to put "private" near the top
      const newPkg = {
        name: pkgData.name,
        version: pkgData.version,
        private: true,
        description: pkgData.description,
        ...pkgData,
      };

      fs.writeFileSync(pkgPath, JSON.stringify(newPkg, null, 2), 'utf8');
      console.log(`Set private: true for ${pkg}`);
    }
  }
}
