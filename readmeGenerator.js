const fs = require('fs');
const path = require('path');

// Function to generate README for a single folder with a custom title
const generateReadMeForFolder = (folderPath, title) => {
  // Read the directory contents
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${folderPath}:`, err);
      return;
    }

    // Filter out directories, keeping only files
    const fileList = files.filter(file => fs.lstatSync(path.join(folderPath, file)).isFile());

    if (fileList.length === 0) {
      console.log(`No files found in ${folderPath}`);
      return;
    }

    // Generate markdown content for the folder with a custom title
    let markdownContent = `## ${title}\n\n`;

    // Add each file to the markdown list
    fileList.forEach(file => {
        if (!file.startsWith('index')) {
            markdownContent += `- [${file}](${path.join(folderPath, file)})\n`;
        }
    });

    // Append content to the README.md file
    fs.appendFile('README.md', markdownContent, (err) => {
      if (err) {
        console.error('Error writing to README.md:', err);
        return;
      }
      console.log(`README.md updated for ${folderPath}`);
    });
  });
};

// Function to generate README for multiple folders
const generateReadMeForMultipleFolders = (folders) => {
  // Create or overwrite the README.md at the beginning
  fs.writeFile('README.md', '# Notes API\n\n', (err) => {
    if (err) {
      console.error('Error creating README.md:', err);
      return;
    }
    console.log('README.md file created successfully!');
    
    // Loop through each folder and generate README content
    folders.forEach(folder => generateReadMeForFolder(folder.path, folder.title));
  });
};


const folderPaths = [
  { path: './src/resolvers/mutations', title: 'Mutations' },
  { path: './src/resolvers/queries', title: 'Queries' },
];

generateReadMeForMultipleFolders(folderPaths);
