package com.placeprep.portal.repository;

import com.placeprep.portal.models.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    List<TestResult> findByUserIdOrderByTimestampDesc(Long userId);
    List<TestResult> findByUserIdAndModuleTypeOrderByTimestampDesc(Long userId, String moduleType);
}
