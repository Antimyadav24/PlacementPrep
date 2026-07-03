package com.placeprep.portal.repository;

import com.placeprep.portal.models.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    List<StudyMaterial> findByCategory(String category);
    List<StudyMaterial> findByType(String type);
}
