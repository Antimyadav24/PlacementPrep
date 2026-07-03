const fs = require('fs');
const path = require('path');

const fetchQuestions = async () => {
  const numQuestions = 50;
  const questions = [];
  console.log(`Fetching ${numQuestions} random questions from Aptitude API...`);

  for (let i = 0; i < numQuestions; i++) {
    try {
      const res = await fetch('https://aptitude-gold.vercel.app/Random');
      const data = await res.json();
      
      // Ensure data is valid
      if (data && data.question && data.options) {
        questions.push({
          id: `apt-api-${i}`,
          question: data.question,
          options: data.options,
          correctAnswer: data.answer,
          explanation: data.explanation,
          difficulty: 'Medium'
        });
      }
    } catch (err) {
      console.error(`Failed to fetch question ${i+1}:`, err.message);
    }
  }

  const dataDir = path.join(__dirname, '..', 'frontend', 'public', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const filePath = path.join(dataDir, 'aptitude-api.json');
  fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
  console.log(`Successfully saved ${questions.length} questions to ${filePath}`);
};

fetchQuestions();
