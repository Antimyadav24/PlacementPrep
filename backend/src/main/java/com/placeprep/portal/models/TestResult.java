package com.placeprep.portal.models;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Data
@NoArgsConstructor
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String moduleType; // "APTITUDE" or "TECHNICAL"
    
    private String category; // e.g., "Java", "Mixed"

    private int score;
    
    private int totalQuestions;
    
    private LocalDateTime timestamp = LocalDateTime.now();
    
    public TestResult(User user, String moduleType, String category, int score, int totalQuestions) {
        this.user = user;
        this.moduleType = moduleType;
        this.category = category;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.timestamp = LocalDateTime.now();
    }
}
