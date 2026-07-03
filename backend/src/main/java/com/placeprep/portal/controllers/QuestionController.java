package com.placeprep.portal.controllers;

import com.placeprep.portal.models.Question;
import com.placeprep.portal.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/{moduleType}")
    public ResponseEntity<?> getQuestionsByModule(@PathVariable String moduleType, @RequestParam(required = false) String category) {
        List<Question> questions;
        
        if (moduleType.equalsIgnoreCase("mock")) {
            return getMockTestQuestions();
        }

        if (category != null && !category.isEmpty()) {
            questions = questionRepository.findByModuleTypeAndCategory(moduleType.toUpperCase(), category);
        } else {
            questions = questionRepository.findByModuleType(moduleType.toUpperCase());
        }
        
        // Shuffle for randomness
        Collections.shuffle(questions);
        
        // Limit to 10 questions for a standard test
        if(questions.size() > 10) {
            questions = questions.subList(0, 10);
        }
        
        return ResponseEntity.ok(questions);
    }

    private ResponseEntity<?> getMockTestQuestions() {
        List<Question> aptitudeQuestions = questionRepository.findByModuleType("APTITUDE");
        List<Question> technicalQuestions = questionRepository.findByModuleType("TECHNICAL");
        
        Collections.shuffle(aptitudeQuestions);
        Collections.shuffle(technicalQuestions);
        
        // Take 5 aptitude and 5 technical for a 10-question mock test
        List<Question> mockQuestions = new ArrayList<>();
        mockQuestions.addAll(aptitudeQuestions.subList(0, Math.min(5, aptitudeQuestions.size())));
        mockQuestions.addAll(technicalQuestions.subList(0, Math.min(5, technicalQuestions.size())));
        
        Collections.shuffle(mockQuestions);
        return ResponseEntity.ok(mockQuestions);
    }
}
