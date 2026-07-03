package com.placeprep.portal.controllers;

import com.placeprep.portal.models.Announcement;
import com.placeprep.portal.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @GetMapping
    public ResponseEntity<List<Announcement>> getActive() {
        return ResponseEntity.ok(announcementRepository.findByActiveTrueOrderByCreatedAtDesc());
    }
}
