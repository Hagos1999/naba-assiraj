const fs = require('fs');
const path = require('path');

const files = ['index.html', 'about.html', 'volunteer.html', 'volunteer-details.html', 'contact.html', 'donate.html'];

files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) return;
    
    let html = fs.readFileSync(filePath, 'utf-8');
    
    const goldenCss = \`
    <!-- Naba Assiraj Golden Aesthetic -->
    <style>
        :root {
            --primary: #D4AF37 !important;
            --brand-main: #D4AF37 !important;
        }
        .primary-button, .n-button-box, .btn-donate, .causes-box-subtext, .calc-total {
            background-color: #D4AF37 !important;
            color: #fff !important;
            border-color: #D4AF37 !important;
        }
        .n-menu-link-text:hover, a:hover {
            color: #C59B27 !important;
        }
        .n-logo {
            max-height: 60px;
        }
        .mini-n-logo {
            max-height: 45px;
        }
    </style>
    \`;
    
    if (!html.includes('--primary: #D4AF37')) {
        html = html.replace('</head>', goldenCss + '</head>');
        fs.writeFileSync(filePath, html, 'utf-8');
        console.log(\`Golden CSS injected into \${file}\`);
    }
});
