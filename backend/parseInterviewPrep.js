const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:\\Users\\vrat1\\OneDrive\\Desktop\\PlacePrepPortal\\Programming-Aptitude-Interview-Prep-main\\Programming-Aptitude-Interview-Prep-main';
const OUTPUT_JSON = 'C:\\Users\\vrat1\\OneDrive\\Desktop\\PlacePrepPortal\\PlacePrepPortal\\frontend\\public\\data\\interview-prep.json';
const PDF_OUT_DIR = 'C:\\Users\\vrat1\\OneDrive\\Desktop\\PlacePrepPortal\\PlacePrepPortal\\frontend\\public\\prep-pdfs';

if (!fs.existsSync(PDF_OUT_DIR)) {
    fs.mkdirSync(PDF_OUT_DIR, { recursive: true });
}

let prepData = [];

function parseDirectory() {
    const categories = fs.readdirSync(ROOT_DIR).filter(item => {
        return fs.statSync(path.join(ROOT_DIR, item)).isDirectory() && !item.startsWith('.');
    });

    categories.forEach(category => {
        const catPath = path.join(ROOT_DIR, category);
        const catObj = { category, problems: [], pdfs: [], looseFiles: [] };
        
        const subItems = fs.readdirSync(catPath);
        subItems.forEach(subItem => {
            const subPath = path.join(catPath, subItem);
            const stat = fs.statSync(subPath);

            if (stat.isDirectory()) {
                // Treat as a Problem Folder
                let problem = { title: subItem, description: '', solution: '', language: '', hasCode: false };
                
                const files = fs.readdirSync(subPath);
                files.forEach(file => {
                    const filePath = path.join(subPath, file);
                    const fileStat = fs.statSync(filePath);
                    if (fileStat.isDirectory()) return; // Ignore nested directories

                    const ext = path.extname(file).toLowerCase();
                    const content = fs.readFileSync(filePath, 'utf-8');

                    if (ext === '.txt' || ext === '.md') {
                        problem.description += content + '\n\n';
                    } else if (ext === '.java' || ext === '.cpp' || ext === '.py' || ext === '.c') {
                        problem.solution = content;
                        problem.language = ext === '.java' ? 'java' : ext === '.py' ? 'python' : 'cpp';
                        problem.hasCode = true;
                    }
                });
                
                catObj.problems.push(problem);
            } else {
                // Loose File
                const ext = path.extname(subItem).toLowerCase();
                if (ext === '.pdf') {
                    // Copy PDF
                    const newPdfName = `${category.replace(/\s+/g, '_')}_${subItem}`;
                    fs.copyFileSync(subPath, path.join(PDF_OUT_DIR, newPdfName));
                    catObj.pdfs.push({ title: subItem, url: `/prep-pdfs/${newPdfName}` });
                } else if (ext === '.txt' || ext === '.md' || ext === '.java') {
                    catObj.looseFiles.push({
                        title: subItem,
                        content: fs.readFileSync(subPath, 'utf-8'),
                        type: ext === '.txt' || ext === '.md' ? 'text' : 'code'
                    });
                }
            }
        });

        if (catObj.problems.length > 0 || catObj.pdfs.length > 0 || catObj.looseFiles.length > 0) {
            prepData.push(catObj);
        }
    });

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(prepData, null, 2));
    console.log(`Parsed ${prepData.length} categories successfully! Saved to ${OUTPUT_JSON}`);
}

parseDirectory();
