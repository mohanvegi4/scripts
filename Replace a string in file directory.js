const fs = require('fs');
const path = require('path');

function searchAndReplace(directoryPath) {
  // Read the contents of the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Iterate over each file in the directory
    files.forEach(file => {
      const filePath = path.join(directoryPath, file);

      // Check if the current item is a file
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error('Error reading file stats:', err);
          return;
        }

        if (stats.isFile()) {
          // Process the file
          processFile(filePath);
        } else if (stats.isDirectory()) {
          // Recursively search within subdirectories
          searchAndReplace(filePath);
        }
      });
    });
  });
}

function processFile(filePath) {
  // Read the contents of the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Replace occurrences of 'rem' or 'em' with updated values
    const updatedData = data.replace(/(\d+\.*\d*)\s*(rem|em)/gi, (match, value, unit) => {
      const updatedValue = parseFloat(value) * 2; // Multiply by 2 as an example

      // Update the value and append the unit
      return updatedValue + unit;
    });

    // Write the updated data back to the file
    fs.writeFile(filePath, updatedData, 'utf8', err => {
      if (err) {
        console.error('Error writing file:', err);
        return;
      }

      console.log(`File updated: ${filePath}`);
    });
  });
}

// Usage: node script.js <directory_path>
const directoryPath = process.argv[2];
if (directoryPath) {
  searchAndReplace(directoryPath);
} else {
  console.error('Please provide a directory path.');
}
