package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String text;

    @NotBlank
    private String optionA;

    @NotBlank
    private String optionB;

    @NotBlank
    private String optionC;

    @NotBlank
    private String optionD;

    @NotBlank
    private String correctOption; // "A", "B", "C", or "D"

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @NotBlank
    private String category; // e.g., "Quantitative Aptitude", "Java"

    @NotBlank
    private String difficulty; // "Easy", "Medium", "Hard"

    @NotBlank
    private String moduleType; // "APTITUDE" or "TECHNICAL"

    private String company; // e.g. "TCS", "Infosys", "Google" (nullable for general)
    
    public Question(String text, String optionA, String optionB, String optionC, String optionD, String correctOption, String explanation, String category, String difficulty, String moduleType) {
        this(text, optionA, optionB, optionC, optionD, correctOption, explanation, category, difficulty, moduleType, null);
    }
    
    public Question(String text, String optionA, String optionB, String optionC, String optionD, String correctOption, String explanation, String category, String difficulty, String moduleType, String company) {
        this.text = text;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctOption = correctOption;
        this.explanation = explanation;
        this.category = category;
        this.difficulty = difficulty;
        this.moduleType = moduleType;
        this.company = company;
    }
}
