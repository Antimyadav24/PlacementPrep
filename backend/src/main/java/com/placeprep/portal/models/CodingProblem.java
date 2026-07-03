package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "coding_problems")
@Data
@NoArgsConstructor
public class CodingProblem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String difficulty; // "Easy", "Medium", "Hard"

    @NotBlank
    private String topic; // e.g. "Arrays", "Linked Lists", "Dynamic Programming"

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description; // description, constraints, examples

    @Column(columnDefinition = "TEXT")
    private String solutionCode; // standard Java/C++/Python solution

    @Column(columnDefinition = "TEXT")
    private String explanation; // step-by-step approach details

    private String companyTags; // comma-separated: Google,TCS,Amazon

    @Column(columnDefinition = "TEXT")
    private String sampleInput;

    @Column(columnDefinition = "TEXT")
    private String sampleOutput;

    private String videoUrl;
    
    private String titleSlug;

    public CodingProblem(String title, String difficulty, String topic, String description, String solutionCode, String explanation) {
        this.title = title;
        this.difficulty = difficulty;
        this.topic = topic;
        this.description = description;
        this.solutionCode = solutionCode;
        this.explanation = explanation;
    }
}
