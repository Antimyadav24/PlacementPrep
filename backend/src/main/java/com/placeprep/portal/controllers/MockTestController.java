package com.placeprep.portal.controllers;

import com.placeprep.portal.models.MockTest;
import com.placeprep.portal.repository.MockTestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mock-tests")
public class MockTestController {

    @Autowired
    private MockTestRepository mockTestRepository;

    @GetMapping
    public ResponseEntity<?> getAllMockTests() {
        List<MockTest> mockTests = mockTestRepository.findAll();
        return ResponseEntity.ok(mockTests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMockTestById(@PathVariable Long id) {
        MockTest test = mockTestRepository.findById(id).orElse(null);
        if (test == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(test);
    }
}
