package com.placeprep.portal.repository;

import com.placeprep.portal.models.Bookmark;
import com.placeprep.portal.models.Question;
import com.placeprep.portal.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserEmail(String email);
    Optional<Bookmark> findByUserEmailAndQuestionId(String email, Long questionId);
}
