package com.placeprep.portal.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "personal_notes")
@Data
@NoArgsConstructor
public class PersonalNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    private String title;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String content;

    private String topic; // Optional category / context

    private LocalDateTime timestamp = LocalDateTime.now();

    public PersonalNote(User user, String title, String content, String topic) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.topic = topic;
        this.timestamp = LocalDateTime.now();
    }
}
