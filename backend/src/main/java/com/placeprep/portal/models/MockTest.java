package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "mock_tests")
@Data
@NoArgsConstructor
public class MockTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String description;

    private int timeLimit; // in minutes

    @NotBlank
    private String difficulty; // "Easy", "Medium", "Hard"

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "mock_test_questions",
        joinColumns = @JoinColumn(name = "mock_test_id"),
        inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions = new ArrayList<>();

    public MockTest(String title, String description, int timeLimit, String difficulty, List<Question> questions) {
        this.title = title;
        this.description = description;
        this.timeLimit = timeLimit;
        this.difficulty = difficulty;
        this.questions = questions;
    }
}
