const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// 1. Update Header Component
const headerPath = path.join(__dirname, 'components', 'header.html');
if (fs.existsSync(headerPath)) {
    let html = fs.readFileSync(headerPath, 'utf-8');
    const $ = cheerio.load(html);

    // Update logos
    $('img.mini-n-logo').attr('src', 'images/logo.png');
    $('img.n-logo').attr('src', 'images/logo.png');

    // Add Language Toggle
    const langToggle = '<div class="lang-toggle" style="display:flex; align-items:center; margin-left:15px; font-weight:bold; color:#D4AF37;">' +
        '<a href="/" style="color:#D4AF37; text-decoration:none;">EN</a>' +
        '<span style="margin:0 5px; color:#333;">|</span>' + 
        '<a href="/ar/" style="color:#333; text-decoration:none;">AR</a>' +
    '</div>';
    
    if ($('.nav-button-main').length && $('.lang-toggle').length === 0) {
        $('.nav-button-main').prepend(langToggle);
    }
    if ($('.menu-button-box').length && $('.lang-toggle').length === 0) {
         $('.button').prepend(langToggle);
    }

    // Top texts
    $('.nav-top-left-text').text("Naba Assiraj - Illuminating Lives Through the Light of the Qur'an");
    $('a[href^="mailto"]').text('info@nabaassiraj.org').attr('href', 'mailto:info@nabaassiraj.org');
    
    fs.writeFileSync(headerPath, $.html(), 'utf-8');
    console.log("Header updated.");
}

// 2. Inject Content & Build AR Directory
const files = ['index.html', 'about.html', 'volunteer.html', 'volunteer-details.html', 'contact.html', 'donate.html'];
const arDir = path.join(__dirname, 'ar');
if (!fs.existsSync(arDir)) fs.mkdirSync(arDir);

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf-8');
    
    // Golden CSS
    const goldenCss = '<style>:root{--primary:#D4AF37 !important;--brand-main:#D4AF37 !important;} .primary-button,.n-button-box,.btn-donate,.causes-box-subtext,.calc-total{background-color:#D4AF37 !important;color:#fff !important;border-color:#D4AF37 !important;} .n-menu-link-text:hover,a:hover{color:#C59B27 !important;} .n-logo{max-height:60px;} .mini-n-logo{max-height:45px;}</style>';
    
    if (!html.includes('--primary:#D4AF37')) {
        let lines = html.split('</head>');
        if(lines.length > 1) {
            lines[0] = lines[0] + goldenCss + '\\n';
            html = lines.join('</head>');
        }
    }

    // Explicit PDF injection logic using basic text replace
    html = html.replace(/Monotonectally transition economically soundy.*?client-based partnerships\\./gs, "Naba Assiraj is a faith-driven, community-focused initiative dedicated to spreading the word of Allah by placing the Holy Qur'an in the hands of Muslims across Africa who would otherwise have no access to one.");
    html = html.replace(/150 Days/g, "Ongoing");
    html = html.replace(/130 Days/g, "Ongoing");
    html = html.replace(/120 Days/g, "Ongoing");
    
    // Update Stats on index.html (these strings must match the template exactly)
    // The Webflow template features dummy components like '8k+' etc. We will rewrite it.
    
    fs.writeFileSync(filePath, html, 'utf-8');

    // Create AR version
    let arHtml = html;
    arHtml = arHtml.replace('<html ', '<html dir="rtl" lang="ar" ');
    
    // Fix paths 
    arHtml = arHtml.replace(/href="([a-zA-Z0-9_-]+\\.css)"/g, 'href="../$1"');
    arHtml = arHtml.replace(/src="([a-zA-Z0-9_-]+\\.js)"/g, 'src="../$1"');
    arHtml = arHtml.replace(/images\\/logo.png/g, '../images/logo.png');

    // Update AR toggle active color
    arHtml = arHtml.replace(/color:#D4AF37; text-decoration:none;">EN/g, 'color:#333; text-decoration:none;">EN');
    arHtml = arHtml.replace(/color:#333; text-decoration:none;">AR/g, 'color:#D4AF37; text-decoration:none;">AR');

    fs.writeFileSync(path.join(arDir, file), arHtml, 'utf-8');
});

console.log('Site Updated and AR files generated!');
