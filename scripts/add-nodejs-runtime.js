// Script to add Node.js runtime declaration to all API routes
const fs = require('fs');
const path = require('path');

// API directory path
const apiDir = path.join(__dirname, '..', 'app', 'api');

// Function to recursively process directories
function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (entry.name === 'route.js') {
      addRuntimeDeclaration(fullPath);
    }
  }
}

// Function to add runtime declaration if not present
function addRuntimeDeclaration(filePath) {
  console.log(`Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if runtime is already declared
  if (!content.includes('export const runtime')) {
    // Find a good spot to insert the runtime declaration
    // Usually after imports and before the first function
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import statement
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim().startsWith('const ') && insertIndex === 0) {
        // If no imports, insert before the first const declaration
        insertIndex = i;
        break;
      } else if (lines[i].trim().startsWith('export ') && insertIndex === 0) {
        // If no imports or consts, insert before the first export
        insertIndex = i;
        break;
      }
    }
    
    // Insert the runtime declaration
    lines.splice(insertIndex, 0, '', '// Explicitly set Node.js runtime', 'export const runtime = \'nodejs\';', '');
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Added runtime declaration to: ${filePath}`);
  } else {
    console.log(`Runtime already declared in: ${filePath}`);
  }
}

// Start processing from the API directory
console.log('Adding Node.js runtime declarations to API routes...');
processDirectory(apiDir);
console.log('Done!');