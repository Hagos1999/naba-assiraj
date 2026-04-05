const fs = require('fs');
const path = require('path');

const files = [
    'about.html', 
    'contact.html', 
    'index.html', 
    'volunteer.html', 
    'volunteer-details.html', 
    'donate.html',
    path.join('components', 'header.html'),
    path.join('components', 'footer.html')
];

const svgArrow = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle; margin-left:4px;"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`;

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace Meta image URL
    const metaImgRegex = /https:\/\/cdn\.prod\.website-files\.com\/[^"]+_(Thumbnail|Favicon|Favicon%20small)\.png/g;
    content = content.replace(metaImgRegex, "images/logo.png");

    content = content.replace(/property="og:image"\s*content="[^"]*"/g, 'property="og:image" content="images/logo.png"');
    content = content.replace(/property="twitter:image"\s*content="[^"]*"/g, 'property="twitter:image" content="images/logo.png"');
    content = content.replace(/rel="shortcut icon"\s*type="image\/x-icon"\s*href="[^"]*"/g, 'rel="shortcut icon" type="image/x-icon" href="images/logo.png"');
    content = content.replace(/rel="apple-touch-icon"\s*href="[^"]*"/g, 'rel="apple-touch-icon" href="images/logo.png"');

    // Remove the emojis / font-icons that act like emojis (e.g. )
    content = content.replace(//g, svgArrow);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated meta tags and icons in ${file}`);
});
