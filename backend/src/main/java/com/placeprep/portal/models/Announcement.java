package com.placeprep.portal.models;

import javax.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "announcements")
@Data
@NoArgsConstructor
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String type = "INFO"; // INFO, ALERT, SUCCESS

    private boolean active = true;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Announcement(String title, String content, String type) {
        this.title = title;
        this.content = content;
        this.type = type;
        this.createdAt = LocalDateTime.now();
    }
}
