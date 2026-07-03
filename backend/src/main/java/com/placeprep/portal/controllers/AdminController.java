package com.placeprep.portal.controllers;

import com.placeprep.portal.models.*;
import com.placeprep.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private StudyMaterialRepository studyMaterialRepository;

    @Autowired
    private MockTestRepository mockTestRepository;

    @Autowired
    private CodingProblemRepository codingProblemRepository;

    @Autowired
    private InterviewResourceRepository interviewResourceRepository;

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private AnnouncementRepository announcementRepository;

    private boolean isNotAdmin(String email) {
        return email == null || !email.trim().equalsIgnoreCase("antimayadav917062@gmail.com");
    }

    // --- Users & Results ---
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/results")
    public ResponseEntity<?> getAllResults(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(testResultRepository.findAll());
    }

    // --- Questions CRUD ---
    @GetMapping("/questions")
    public ResponseEntity<?> getAllQuestions(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(questionRepository.findAll());
    }

    @PostMapping("/questions")
    public ResponseEntity<?> addQuestion(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody Question question) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        questionRepository.save(question);
        return ResponseEntity.ok("Question added successfully!");
    }

    @PutMapping("/questions/{id}")
    public ResponseEntity<?> updateQuestion(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody Question questionDetails) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        Question question = questionRepository.findById(id).orElse(null);
        if (question == null) return ResponseEntity.notFound().build();

        question.setText(questionDetails.getText());
        question.setOptionA(questionDetails.getOptionA());
        question.setOptionB(questionDetails.getOptionB());
        question.setOptionC(questionDetails.getOptionC());
        question.setOptionD(questionDetails.getOptionD());
        question.setCorrectOption(questionDetails.getCorrectOption());
        question.setCategory(questionDetails.getCategory());
        question.setDifficulty(questionDetails.getDifficulty());
        question.setModuleType(questionDetails.getModuleType());
        question.setExplanation(questionDetails.getExplanation());
        question.setCompany(questionDetails.getCompany());

        questionRepository.save(question);
        return ResponseEntity.ok("Question updated successfully!");
    }

    @DeleteMapping("/questions/{id}")
    public ResponseEntity<?> deleteQuestion(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        questionRepository.deleteById(id);
        return ResponseEntity.ok("Question deleted successfully!");
    }

    // --- Study Materials CRUD ---
    @GetMapping("/study-materials")
    public ResponseEntity<?> getAllStudyMaterials(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(studyMaterialRepository.findAll());
    }

    @PostMapping("/study-materials")
    public ResponseEntity<?> addStudyMaterial(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody StudyMaterial material) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        studyMaterialRepository.save(material);
        return ResponseEntity.ok("Study material added successfully!");
    }

    @PutMapping("/study-materials/{id}")
    public ResponseEntity<?> updateStudyMaterial(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody StudyMaterial details) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        StudyMaterial material = studyMaterialRepository.findById(id).orElse(null);
        if (material == null) return ResponseEntity.notFound().build();

        material.setTitle(details.getTitle());
        material.setType(details.getType());
        material.setUrl(details.getUrl());
        material.setContent(details.getContent());
        material.setCategory(details.getCategory());

        studyMaterialRepository.save(material);
        return ResponseEntity.ok("Study material updated successfully!");
    }

    @DeleteMapping("/study-materials/{id}")
    public ResponseEntity<?> deleteStudyMaterial(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        studyMaterialRepository.deleteById(id);
        return ResponseEntity.ok("Study material deleted successfully!");
    }

    // --- Mock Tests CRUD ---
    @GetMapping("/mock-tests")
    public ResponseEntity<?> getAllMockTestsAdmin(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(mockTestRepository.findAll());
    }

    @PostMapping("/mock-tests")
    public ResponseEntity<?> addMockTest(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody MockTest mockTest) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        // Save the questions reference from DB first to be safe
        List<Question> attachedQuestions = new ArrayList<>();
        if (mockTest.getQuestions() != null) {
            for (Question q : mockTest.getQuestions()) {
                if (q.getId() != null) {
                    questionRepository.findById(q.getId()).ifPresent(attachedQuestions::add);
                }
            }
        }
        mockTest.setQuestions(attachedQuestions);
        mockTestRepository.save(mockTest);
        return ResponseEntity.ok("Mock test created successfully!");
    }

    @PutMapping("/mock-tests/{id}")
    public ResponseEntity<?> updateMockTest(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody MockTest details) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        MockTest test = mockTestRepository.findById(id).orElse(null);
        if (test == null) return ResponseEntity.notFound().build();

        test.setTitle(details.getTitle());
        test.setDescription(details.getDescription());
        test.setTimeLimit(details.getTimeLimit());
        test.setDifficulty(details.getDifficulty());
        
        List<Question> attachedQuestions = new ArrayList<>();
        if (details.getQuestions() != null) {
            for (Question q : details.getQuestions()) {
                if (q.getId() != null) {
                    questionRepository.findById(q.getId()).ifPresent(attachedQuestions::add);
                }
            }
        }
        test.setQuestions(attachedQuestions);

        mockTestRepository.save(test);
        return ResponseEntity.ok("Mock test updated successfully!");
    }

    @DeleteMapping("/mock-tests/{id}")
    public ResponseEntity<?> deleteMockTest(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        mockTestRepository.deleteById(id);
        return ResponseEntity.ok("Mock test deleted successfully!");
    }

    // --- Coding Problems CRUD ---
    @GetMapping("/coding-problems")
    public ResponseEntity<?> getAllCodingProblemsAdmin(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(codingProblemRepository.findAll());
    }

    @PostMapping("/coding-problems")
    public ResponseEntity<?> addCodingProblem(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody CodingProblem problem) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        codingProblemRepository.save(problem);
        return ResponseEntity.ok("Coding problem added successfully!");
    }

    @PutMapping("/coding-problems/{id}")
    public ResponseEntity<?> updateCodingProblem(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody CodingProblem details) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        CodingProblem problem = codingProblemRepository.findById(id).orElse(null);
        if (problem == null) return ResponseEntity.notFound().build();

        problem.setTitle(details.getTitle());
        problem.setDifficulty(details.getDifficulty());
        problem.setTopic(details.getTopic());
        problem.setDescription(details.getDescription());
        problem.setSolutionCode(details.getSolutionCode());
        problem.setExplanation(details.getExplanation());

        codingProblemRepository.save(problem);
        return ResponseEntity.ok("Coding problem updated successfully!");
    }

    @DeleteMapping("/coding-problems/{id}")
    public ResponseEntity<?> deleteCodingProblem(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        codingProblemRepository.deleteById(id);
        return ResponseEntity.ok("Coding problem deleted successfully!");
    }

    // --- Interview Resources CRUD ---
    @GetMapping("/interview-resources")
    public ResponseEntity<?> getAllInterviewResourcesAdmin(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        return ResponseEntity.ok(interviewResourceRepository.findAll());
    }

    @PostMapping("/interview-resources")
    public ResponseEntity<?> addInterviewResource(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody InterviewResource resource) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        interviewResourceRepository.save(resource);
        return ResponseEntity.ok("Interview resource added successfully!");
    }

    @PutMapping("/interview-resources/{id}")
    public ResponseEntity<?> updateInterviewResource(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id,
            @RequestBody InterviewResource details) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        InterviewResource resource = interviewResourceRepository.findById(id).orElse(null);
        if (resource == null) return ResponseEntity.notFound().build();

        resource.setCategory(details.getCategory());
        resource.setTitle(details.getTitle());
        resource.setContent(details.getContent());
        resource.setCompany(details.getCompany());
        resource.setAuthorName(details.getAuthorName());

        interviewResourceRepository.save(resource);
        return ResponseEntity.ok("Interview resource updated successfully!");
    }

    @DeleteMapping("/interview-resources/{id}")
    public ResponseEntity<?> deleteInterviewResource(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) {
            return ResponseEntity.status(403).body("Access Denied: Non-admin access prohibited.");
        }
        interviewResourceRepository.deleteById(id);
        return ResponseEntity.ok("Interview resource deleted successfully!");
    }

    // --- Announcements CRUD ---
    @GetMapping("/announcements")
    public ResponseEntity<?> getAllAnnouncements(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (isNotAdmin(email)) return ResponseEntity.status(403).body("Access Denied");
        return ResponseEntity.ok(announcementRepository.findAll());
    }

    @PostMapping("/announcements")
    public ResponseEntity<?> addAnnouncement(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody Announcement announcement) {
        if (isNotAdmin(email)) return ResponseEntity.status(403).body("Access Denied");
        announcementRepository.save(announcement);
        return ResponseEntity.ok("Announcement created");
    }

    @PutMapping("/announcements/{id}")
    public ResponseEntity<?> updateAnnouncement(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id, @RequestBody Announcement details) {
        if (isNotAdmin(email)) return ResponseEntity.status(403).body("Access Denied");
        Announcement a = announcementRepository.findById(id).orElse(null);
        if (a == null) return ResponseEntity.notFound().build();
        a.setTitle(details.getTitle());
        a.setContent(details.getContent());
        a.setType(details.getType());
        a.setActive(details.isActive());
        announcementRepository.save(a);
        return ResponseEntity.ok("Announcement updated");
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<?> deleteAnnouncement(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @PathVariable Long id) {
        if (isNotAdmin(email)) return ResponseEntity.status(403).body("Access Denied");
        announcementRepository.deleteById(id);
        return ResponseEntity.ok("Announcement deleted");
    }

    @PostMapping("/questions/bulk-delete")
    public ResponseEntity<?> bulkDeleteQuestions(
            @RequestHeader(value = "X-User-Email", required = false) String email,
            @RequestBody List<Long> ids) {
        if (isNotAdmin(email)) return ResponseEntity.status(403).body("Access Denied");
        questionRepository.deleteAllById(ids);
        return ResponseEntity.ok("Deleted " + ids.size() + " questions");
    }
}
