const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const dbPath = path.join(__dirname, 'db.json');

// 1. Parse TCS NQT PYQ QUESTIONS
const tcsMdPath = path.join(projectRoot, 'TCS-NQT-PYQ-QUESTIONS-main', 'TCS-NQT-PYQ-QUESTIONS-main', 'questions.md');
let tcsNqtQuestions = [];

if (fs.existsSync(tcsMdPath)) {
    const mdContent = fs.readFileSync(tcsMdPath, 'utf-8');
    const questions = mdContent.split('## Q').slice(1);
    
    questions.forEach((q, index) => {
        const lines = q.split('\n');
        const titleLine = lines[0].trim();
        let qObj = {
            id: index + 1,
            title: 'Q' + titleLine,
            problem: '',
            constraints: '',
            sampleInput: '',
            sampleOutput: '',
            hint: ''
        };
        
        let currentSection = '';
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('**Problem**')) { currentSection = 'problem'; continue; }
            if (line.startsWith('**Constraints**')) { currentSection = 'constraints'; continue; }
            if (line.startsWith('**Sample Input**')) { currentSection = 'sampleInput'; continue; }
            if (line.startsWith('**Sample Output**')) { currentSection = 'sampleOutput'; continue; }
            if (line.startsWith('**Explanation**')) { currentSection = 'explanation'; continue; }
            if (line.startsWith('**Hint**')) { currentSection = 'hint'; continue; }
            
            if (line.startsWith('```')) continue; // Skip markdown code blocks
            if (line.startsWith('---')) continue; // Skip dividers
            
            if (currentSection && line) {
                if (qObj[currentSection] !== undefined) {
                    qObj[currentSection] += (qObj[currentSection] ? '\n' : '') + line;
                }
            }
        }
        tcsNqtQuestions.push(qObj);
    });
}

// 2. Parse TCS Coding Questions
const tcsCodingPath = path.join(projectRoot, 'TCS_Coding_Questions-main', 'TCS_Coding_Questions-main');
let tcsCodingQuestions = [];

if (fs.existsSync(tcsCodingPath)) {
    const files = fs.readdirSync(tcsCodingPath).filter(f => f.endsWith('.cpp'));
    files.forEach((file, index) => {
        const content = fs.readFileSync(path.join(tcsCodingPath, file), 'utf-8');
        const lines = content.split('\n');
        
        let comments = [];
        let codeLines = [];
        
        lines.forEach(line => {
            if (line.trim().startsWith('//')) {
                comments.push(line.replace('//', '').trim());
            } else {
                codeLines.push(line);
            }
        });
        
        tcsCodingQuestions.push({
            id: index + 1,
            fileName: file,
            description: comments.join('\n'),
            solution: codeLines.join('\n').trim()
        });
    });
}

// 3. Write to frontend public directory
const dataDir = path.join(projectRoot, 'frontend', 'public', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(path.join(dataDir, 'tcs-nqt.json'), JSON.stringify(tcsNqtQuestions, null, 2));
fs.writeFileSync(path.join(dataDir, 'tcs-coding.json'), JSON.stringify(tcsCodingQuestions, null, 2));
console.log('Successfully saved TCS questions to frontend/public/data!');
