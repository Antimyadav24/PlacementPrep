package com.placeprep.portal.controllers;

import com.placeprep.portal.models.CodingProblem;
import com.placeprep.portal.repository.CodingProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/coding-problems")
public class CodingProblemController {

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @GetMapping
    public ResponseEntity<?> getCodingProblems(@RequestParam(required = false) String topic) {
        List<CodingProblem> problems;
        if (topic != null && !topic.isEmpty()) {
            problems = codingProblemRepository.findByTopic(topic);
        } else {
            problems = codingProblemRepository.findAll();
        }
        return ResponseEntity.ok(problems);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProblemById(@PathVariable Long id) {
        CodingProblem problem = codingProblemRepository.findById(id).orElse(null);
        if (problem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(problem);
    }
}
