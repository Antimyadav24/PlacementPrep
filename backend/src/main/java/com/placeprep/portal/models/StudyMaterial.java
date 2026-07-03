package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Data
@NoArgsConstructor
public class StudyMaterial {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    @NotBlank
    private String type; // "PDF", "VIDEO", "ARTICLE"

    private String url; // For PDF file link or YouTube embed link

    @Column(columnDefinition = "TEXT")
    private String content; // Text details / personal notes content

    @NotBlank
    private String category; // e.g. "core-java", "dbms", "quantitative", etc.

    private LocalDateTime timestamp = LocalDateTime.now();

    public StudyMaterial(String title, String type, String url, String content, String category) {
        this.title = title;
        this.type = type;
        this.url = url;
        this.content = content;
        this.category = category;
        this.timestamp = LocalDateTime.now();
    }
}
