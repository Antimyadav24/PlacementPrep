package com.placeprep.portal.controllers;

import com.placeprep.portal.models.InterviewResource;
import com.placeprep.portal.repository.InterviewResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview-resources")
public class InterviewResourceController {

    @Autowired
    private InterviewResourceRepository interviewResourceRepository;

    @GetMapping
    public ResponseEntity<?> getInterviewResources(@RequestParam(required = false) String category) {
        List<InterviewResource> resources;
        if (category != null && !category.isEmpty()) {
            resources = interviewResourceRepository.findByCategory(category.toUpperCase());
        } else {
            resources = interviewResourceRepository.findAll();
        }
        return ResponseEntity.ok(resources);
    }
}
