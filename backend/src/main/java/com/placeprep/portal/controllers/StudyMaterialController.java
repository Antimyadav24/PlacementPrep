package com.placeprep.portal.controllers;

import com.placeprep.portal.models.StudyMaterial;
import com.placeprep.portal.repository.StudyMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-materials")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @GetMapping
    public ResponseEntity<?> getStudyMaterials(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String type) {
        
        List<StudyMaterial> materials;
        if (category != null && !category.isEmpty()) {
            materials = studyMaterialRepository.findByCategory(category);
        } else if (type != null && !type.isEmpty()) {
            materials = studyMaterialRepository.findByType(type);
        } else {
            materials = studyMaterialRepository.findAll();
        }
        return ResponseEntity.ok(materials);
    }
}
