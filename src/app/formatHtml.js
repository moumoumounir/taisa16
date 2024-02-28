const fs = require('fs');
const beautify = require('js-beautify').html;

// Read the existing HTML file
const filePath = '../../../test.html';
const htmlContent = fs.readFileSync(filePath, 'utf-8');

// Beautify the HTML content
const beautifiedHtml = beautify(htmlContent, { indent_size: 2 });

// Save the beautified HTML back to the file
fs.writeFileSync(filePath, beautifiedHtml, 'utf-8');

console.log('HTML file beautified successfully.');
