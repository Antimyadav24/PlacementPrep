package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_resources")
@Data
@NoArgsConstructor
public class InterviewResource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String category; // "HR", "TECHNICAL", "RESUME", "EXPERIENCE"

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;

    private String company; // e.g. "TCS", "Amazon" (optional)

    private String authorName; // e.g. "Rahul Kumar" (optional, for experiences)

    private LocalDateTime timestamp = LocalDateTime.now();

    public InterviewResource(String category, String title, String content, String company, String authorName) {
        this.category = category;
        this.title = title;
        this.content = content;
        this.company = company;
        this.authorName = authorName;
        this.timestamp = LocalDateTime.now();
    }
}
