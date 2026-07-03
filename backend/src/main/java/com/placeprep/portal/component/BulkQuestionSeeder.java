package com.placeprep.portal.component;

import com.placeprep.portal.models.Question;
import com.placeprep.portal.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BulkQuestionSeeder {

    @Autowired
    private QuestionRepository questionRepository;

    private static final String[][] APTITUDE_CATEGORIES = {
        {"quantitative", "Quantitative Aptitude"},
        {"logical-reasoning", "Logical Reasoning"},
        {"verbal-ability", "Verbal Ability"},
        {"data-interpretation", "Data Interpretation"}
    };

    private static final String[][] TECHNICAL_CATEGORIES = {
        {"core-java", "Core Java"},
        {"dbms", "DBMS"},
        {"operating-systems", "Operating Systems"},
        {"computer-networks", "Computer Networks"},
        {"data-structures", "Data Structures"}
    };

    private static final String[] DIFFICULTIES = {"Easy", "Medium", "Hard"};
    private static final String[] COMPANIES = {"TCS", "Infosys", "Wipro", "Amazon", "Google", "Microsoft", "Accenture", "Capgemini"};

    public void seedIfNeeded() {
        long count = questionRepository.count();
        if (count >= 1000) return;

        questionRepository.deleteAll();
        List<Question> all = new ArrayList<>();
        all.addAll(generateQuestions("APTITUDE", APTITUDE_CATEGORIES, 500));
        all.addAll(generateQuestions("TECHNICAL", TECHNICAL_CATEGORIES, 500));
        questionRepository.saveAll(all);
    }

    private List<Question> generateQuestions(String moduleType, String[][] categories, int total) {
        List<Question> questions = new ArrayList<>();
        int perCategory = total / categories.length;
        int qNum = 1;

        for (String[] cat : categories) {
            String categoryId = cat[0];
            String categoryName = cat[1];
            for (int i = 1; i <= perCategory; i++) {
                String difficulty = DIFFICULTIES[i % DIFFICULTIES.length];
                String company = COMPANIES[i % COMPANIES.length];
                String text = String.format("%s Question #%d: Solve the following %s problem.",
                    categoryName, qNum, difficulty.toLowerCase());
                String explanation = String.format(
                    "This is a %s level %s question. Review core concepts of %s and practice similar problems.",
                    difficulty, categoryName, categoryName
                );
                questions.add(new Question(
                    text,
                    "Option A - " + categoryName + " concept",
                    "Option B - Alternative approach",
                    "Option C - Common misconception",
                    "Option D - None of the above",
                    i % 4 == 0 ? "D" : i % 3 == 0 ? "C" : i % 2 == 0 ? "B" : "A",
                    explanation,
                    categoryId,
                    difficulty,
                    moduleType,
                    company
                ));
                qNum++;
            }
        }
        return questions;
    }
}
