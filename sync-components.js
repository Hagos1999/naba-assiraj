const fs = require('fs');
const path = require('path');

const headerHtml = fs.readFileSync(path.join(__dirname, 'components', 'header.html'), 'utf-8');
const footerHtml = fs.readFileSync(path.join(__dirname, 'components', 'footer.html'), 'utf-8');

const files = ['about.html', 'contact.html', 'index.html', 'volunteer.html', 'volunteer-details.html', 'donate.html'];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace everything between <!-- START HEADER --> and <!-- END HEADER -->
    // For the first time, we replace <header>...</header> with the markers
    if (!content.includes('<!-- START HEADER -->')) {
        content = content.replace(/<header>.*<\/header>/s, `<!-- START HEADER -->\n${headerHtml}\n<!-- END HEADER -->`);
    } else {
        content = content.replace(/<!-- START HEADER -->.*<!-- END HEADER -->/s, `<!-- START HEADER -->\n${headerHtml}\n<!-- END HEADER -->`);
    }
    
    // Replace everything between <!-- START FOOTER --> and <!-- END FOOTER -->
    if (!content.includes('<!-- START FOOTER -->')) {
        content = content.replace(/<footer>.*<\/footer>/s, `<!-- START FOOTER -->\n${footerHtml}\n<!-- END FOOTER -->`);
    } else {
        content = content.replace(/<!-- START FOOTER -->.*<!-- END FOOTER -->/s, `<!-- START FOOTER -->\n${footerHtml}\n<!-- END FOOTER -->`);
    }

    // specific fix for donate.html which uses placeholder IDs
    if (file === 'donate.html') {
        content = content.replace('<div id="header-placeholder"></div>', `<!-- START HEADER -->\n${headerHtml}\n<!-- END HEADER -->`);
        content = content.replace('<div id="footer-placeholder"></div>', `<!-- START FOOTER -->\n${footerHtml}\n<!-- END FOOTER -->`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Synchronized ${file}`);
});
