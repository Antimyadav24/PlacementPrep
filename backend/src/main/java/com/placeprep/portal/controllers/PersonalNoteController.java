package com.placeprep.portal.controllers;

import com.placeprep.portal.models.PersonalNote;
import com.placeprep.portal.models.User;
import com.placeprep.portal.repository.PersonalNoteRepository;
import com.placeprep.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
public class PersonalNoteController {

    @Autowired
    private PersonalNoteRepository personalNoteRepository;

    @Autowired
    private UserRepository userRepository;

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
    public ResponseEntity<?> getNotes(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Name", required = false) String name) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }
        
        List<PersonalNote> notes = personalNoteRepository.findByUserEmailOrderByTimestampDesc(email);
        return ResponseEntity.ok(notes);
    }

    @PostMapping
    public ResponseEntity<?> createNote(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestHeader(value = "X-User-Name", required = false) String name,
            @RequestBody PersonalNote noteDetails) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        User user = getOrCreateUser(email, name);
        if (user == null) {
            return ResponseEntity.badRequest().body("Error: User context failed.");
        }

        PersonalNote note = new PersonalNote(
                user,
                noteDetails.getTitle(),
                noteDetails.getContent(),
                noteDetails.getTopic()
        );
        
        personalNoteRepository.save(note);
        return ResponseEntity.ok(note);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNote(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody PersonalNote noteDetails) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        PersonalNote note = personalNoteRepository.findById(id).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        // Check ownership
        if (!note.getUser().getEmail().equalsIgnoreCase(email)) {
            return ResponseEntity.status(403).body("Error: Unauthorized to modify this note.");
        }

        note.setTitle(noteDetails.getTitle());
        note.setContent(noteDetails.getContent());
        note.setTopic(noteDetails.getTopic());
        
        personalNoteRepository.save(note);
        return ResponseEntity.ok(note);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNote(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Error: Email is required.");
        }

        PersonalNote note = personalNoteRepository.findById(id).orElse(null);
        if (note == null) {
            return ResponseEntity.notFound().build();
        }

        // Check ownership
        if (!note.getUser().getEmail().equalsIgnoreCase(email)) {
            return ResponseEntity.status(403).body("Error: Unauthorized to delete this note.");
        }

        personalNoteRepository.delete(note);
        return ResponseEntity.ok("Note deleted successfully");
    }
}
