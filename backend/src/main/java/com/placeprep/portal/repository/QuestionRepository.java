package com.placeprep.portal.repository;

import com.placeprep.portal.models.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByModuleType(String moduleType);
    List<Question> findByModuleTypeAndCategory(String moduleType, String category);
}
