package com.placeprep.portal.controllers;

import com.placeprep.portal.models.Bookmark;
import com.placeprep.portal.models.Question;
import com.placeprep.portal.models.User;
import com.placeprep.portal.repository.BookmarkRepository;
import com.placeprep.portal.repository.QuestionRepository;
import com.placeprep.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookmarks")
public class BookmarkController {

    @Autowired
    private BookmarkRepository bookmarkRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private User getOrCreateUser(String email, String name) {
        if (email == null || email.trim().isEmpty()) {
            return null;
        }
        return userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullName(name != null && !name.trim().isEmpty() ? name : email.split("@")[0]);
            newUser.setPassword("CLERK_AUTH_EXTERNAL_USER_" + java.util.UUID.randomUUID().toString());
            newUser.setCollegeName("Clerk External");
            newUser.setBranch("Clerk External");
            return userRepository.save(newUser);
        });
    }

    @GetMapping
    public ResponseEntity<?> getBookmarks(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Name", required = false) String name) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }
        
        List<Bookmark> bookmarks = bookmarkRepository.findByUserEmail(email);
        return ResponseEntity.ok(bookmarks);
    }

    @PostMapping("/toggle/{questionId}")
    public ResponseEntity<?> toggleBookmark(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Name", required = false) String name,
            @PathVariable Long questionId) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        User user = getOrCreateUser(email, name);
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User context failed.");
        }

        Question question = questionRepository.findById(questionId).orElse(null);
        if (question == null) {
            return ResponseEntity.notFound().build();
        }

        Optional<Bookmark> existing = bookmarkRepository.findByUserEmailAndQuestionId(email, questionId);
        Map<String, Object> response = new HashMap<>();
        
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            response.put("bookmarked", false);
            response.put("message", "Bookmark removed");
        } else {
            Bookmark bookmark = new Bookmark(user, question);
            bookmarkRepository.save(bookmark);
            response.put("bookmarked", true);
            response.put("message", "Bookmark added");
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{questionId}")
    public ResponseEntity<?> checkBookmark(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long questionId) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.ok(Map.of("bookmarked", false));
        }

        Optional<Bookmark> existing = bookmarkRepository.findByUserEmailAndQuestionId(email, questionId);
        return ResponseEntity.ok(Map.of("bookmarked", existing.isPresent()));
    }
}
