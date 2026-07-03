package com.placeprep.portal.repository;

import com.placeprep.portal.models.InterviewResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewResourceRepository extends JpaRepository<InterviewResource, Long> {
    List<InterviewResource> findByCategory(String category);
}
