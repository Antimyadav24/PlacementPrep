package com.placeprep.portal.controllers;

import com.placeprep.portal.models.TestResult;
import com.placeprep.portal.models.User;
import com.placeprep.portal.payload.request.TestSubmitRequest;
import com.placeprep.portal.payload.response.MessageResponse;
import com.placeprep.portal.payload.response.LeaderboardEntry;
import com.placeprep.portal.repository.TestResultRepository;
import com.placeprep.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/results")
public class TestResultController {

    @Autowired
    private TestResultRepository testResultRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitTest(
            @RequestHeader(value = "X-User-Email", required = false) String headerEmail,
            @RequestHeader(value = "X-User-Name", required = false) String headerName,
            @RequestBody TestSubmitRequest request) {
        
        String email = headerEmail;
        if (email == null || email.trim().isEmpty()) {
            email = request.getEmail();
        }
        
        String name = headerName;
        if (name == null || name.trim().isEmpty()) {
            name = request.getFullName();
        }
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: User email is required."));
        }
        
        if (name == null || name.trim().isEmpty()) {
            name = email.split("@")[0];
        }
        
        final String finalEmail = email;
        final String finalName = name;
        
        User user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(finalEmail);
            newUser.setFullName(finalName);
            newUser.setPassword("CLERK_AUTH_EXTERNAL_USER_" + java.util.UUID.randomUUID().toString());
            newUser.setCollegeName("Clerk External");
            newUser.setBranch("Clerk External");
            return userRepository.save(newUser);
        });

        TestResult result = new TestResult(
                user,
                request.getModuleType(),
                request.getCategory(),
                request.getScore(),
                request.getTotalQuestions()
        );

        testResultRepository.save(result);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(@RequestHeader(value = "X-User-Email", required = false) String email) {
        if (email != null && !email.trim().isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isPresent()) {
                List<TestResult> results = testResultRepository.findByUserIdOrderByTimestampDesc(userOpt.get().getId());
                return ResponseEntity.ok(results);
            } else {
                return ResponseEntity.ok(Collections.emptyList());
            }
        }
        List<TestResult> results = testResultRepository.findAll();
        Collections.reverse(results);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard(@RequestParam(required = false) String period) {
        List<User> users = userRepository.findAll();
        List<LeaderboardEntry> leaderboard = users.stream().map(u -> {
            List<TestResult> userResults = testResultRepository.findByUserIdOrderByTimestampDesc(u.getId());
            
            LocalDateTime now = LocalDateTime.now();
            if ("weekly".equalsIgnoreCase(period)) {
                userResults = userResults.stream()
                        .filter(r -> r.getTimestamp().isAfter(now.minusDays(7)))
                        .collect(Collectors.toList());
            } else if ("monthly".equalsIgnoreCase(period)) {
                userResults = userResults.stream()
                        .filter(r -> r.getTimestamp().isAfter(now.minusDays(30)))
                        .collect(Collectors.toList());
            }

            int totalScore = userResults.stream().mapToInt(TestResult::getScore).sum();
            int totalQuestions = userResults.stream().mapToInt(TestResult::getTotalQuestions).sum();
            int accuracy = totalQuestions > 0 ? (totalScore * 100) / totalQuestions : 0;
            
            return new LeaderboardEntry(
                u.getId().toString(),
                u.getFullName(),
                totalScore,
                userResults.size(),
                accuracy
            );
        }).collect(Collectors.toList());

        leaderboard.sort((a, b) -> b.getTotalScore() - a.getTotalScore());
        return ResponseEntity.ok(leaderboard);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<?> getDashboardStats(@RequestHeader(value = "X-User-Email", required = false) String email) {
        Map<String, Object> stats = new HashMap<>();
        
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required."));
        }
        
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (!userOpt.isPresent()) {
            stats.put("totalQuestionsSolved", 0);
            stats.put("accuracyRate", 0);
            stats.put("weeklyProgress", Collections.emptyList());
            stats.put("weakTopics", List.of("None"));
            stats.put("strongTopics", List.of("None"));
            stats.put("recentActivity", Collections.emptyList());
            stats.put("rank", "-");
            stats.put("totalUsers", userRepository.count());
            return ResponseEntity.ok(stats);
        }
        
        User user = userOpt.get();
        List<TestResult> results = testResultRepository.findByUserIdOrderByTimestampDesc(user.getId());
        
        int totalQuestionsSolved = results.stream().mapToInt(TestResult::getTotalQuestions).sum();
        int totalCorrect = results.stream().mapToInt(TestResult::getScore).sum();
        int accuracyRate = totalQuestionsSolved > 0 ? (totalCorrect * 100) / totalQuestionsSolved : 0;
        
        // Group by category to find weak and strong topics
        Map<String, List<TestResult>> byCategory = results.stream()
            .collect(Collectors.groupingBy(TestResult::getCategory));
            
        List<String> weakTopics = new ArrayList<>();
        List<String> strongTopics = new ArrayList<>();
        
        for (Map.Entry<String, List<TestResult>> entry : byCategory.entrySet()) {
            String category = entry.getKey();
            List<TestResult> catResults = entry.getValue();
            int catTotal = catResults.stream().mapToInt(TestResult::getTotalQuestions).sum();
            int catCorrect = catResults.stream().mapToInt(TestResult::getScore).sum();
            int catAccuracy = catTotal > 0 ? (catCorrect * 100) / catTotal : 0;
            
            String formattedCategory = category.replace("-", " ");
            formattedCategory = Character.toUpperCase(formattedCategory.charAt(0)) + formattedCategory.substring(1);
            
            if (catAccuracy < 60) {
                weakTopics.add(formattedCategory);
            } else if (catAccuracy >= 80) {
                strongTopics.add(formattedCategory);
            }
        }
        
        if (weakTopics.isEmpty()) weakTopics.add("None");
        if (strongTopics.isEmpty()) strongTopics.add("None");

        // Prepare weekly progress data (past 7 days)
        List<Map<String, Object>> weeklyProgress = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime day = now.minusDays(i);
            int year = day.getYear();
            int month = day.getMonthValue();
            int date = day.getDayOfMonth();
            
            int dayTotalSolved = results.stream()
                .filter(r -> r.getTimestamp().getYear() == year &&
                             r.getTimestamp().getMonthValue() == month &&
                             r.getTimestamp().getDayOfMonth() == date)
                .mapToInt(TestResult::getTotalQuestions)
                .sum();
            
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("day", day.getDayOfWeek().toString().substring(0, 3));
            dayMap.put("solved", dayTotalSolved);
            weeklyProgress.add(dayMap);
        }
        
        stats.put("totalQuestionsSolved", totalQuestionsSolved);
        stats.put("accuracyRate", accuracyRate);
        stats.put("weeklyProgress", weeklyProgress);
        stats.put("weakTopics", weakTopics);
        stats.put("strongTopics", strongTopics);
        stats.put("recentActivity", results.size() > 5 ? results.subList(0, 5) : results);
        
        // Rank calculation
        List<User> allUsers = userRepository.findAll();
        List<Map<String, Object>> rankList = new ArrayList<>();
        for (User u : allUsers) {
            List<TestResult> uRes = testResultRepository.findByUserIdOrderByTimestampDesc(u.getId());
            int uScore = uRes.stream().mapToInt(TestResult::getScore).sum();
            Map<String, Object> rm = new HashMap<>();
            rm.put("userId", u.getId());
            rm.put("score", uScore);
            rankList.add(rm);
        }
        rankList.sort((a, b) -> (Integer) b.get("score") - (Integer) a.get("score"));
        int userRank = 1;
        for (int i = 0; i < rankList.size(); i++) {
            if (rankList.get(i).get("userId").equals(user.getId())) {
                userRank = i + 1;
                break;
            }
        }
        stats.put("rank", "#" + userRank);
        stats.put("totalUsers", allUsers.size());

        // Streak: consecutive days with at least one submission
        int streak = 0;
        LocalDateTime checkDay = now.toLocalDate().atStartOfDay();
        Set<String> activeDays = results.stream()
            .map(r -> r.getTimestamp().toLocalDate().toString())
            .collect(Collectors.toSet());
        while (activeDays.contains(checkDay.toLocalDate().toString())) {
            streak++;
            checkDay = checkDay.minusDays(1);
        }
        stats.put("streak", streak);

        // Daily goal progress
        int dailyGoal = 20;
        int todaySolved = results.stream()
            .filter(r -> r.getTimestamp().toLocalDate().equals(now.toLocalDate()))
            .mapToInt(TestResult::getTotalQuestions)
            .sum();
        stats.put("dailyGoal", dailyGoal);
        stats.put("dailyProgress", todaySolved);

        // Badges
        List<Map<String, String>> badges = new ArrayList<>();
        if (totalQuestionsSolved >= 50) badges.add(Map.of("name", "Quick Learner", "icon", "zap"));
        if (totalQuestionsSolved >= 200) badges.add(Map.of("name", "MCQ Master", "icon", "award"));
        if (accuracyRate >= 80) badges.add(Map.of("name", "Accuracy Pro", "icon", "target"));
        if (streak >= 7) badges.add(Map.of("name", "7-Day Streak", "icon", "flame"));
        if (results.size() >= 10) badges.add(Map.of("name", "Test Warrior", "icon", "trophy"));
        stats.put("badges", badges);

        // Recommended topics from weak areas
        List<String> recommended = weakTopics.stream()
            .filter(t -> !t.equals("None"))
            .limit(3)
            .collect(Collectors.toList());
        if (recommended.isEmpty()) recommended = List.of("quantitative", "core-java", "data-structures");
        stats.put("recommendedTopics", recommended);

        // Continue learning
        if (!results.isEmpty()) {
            TestResult last = results.get(0);
            Map<String, String> continueLearning = new HashMap<>();
            continueLearning.put("moduleType", last.getModuleType());
            continueLearning.put("category", last.getCategory());
            continueLearning.put("label", last.getCategory().replace("-", " "));
            stats.put("continueLearning", continueLearning);
        } else {
            stats.put("continueLearning", Map.of("moduleType", "APTITUDE", "category", "quantitative", "label", "Quantitative Aptitude"));
        }
        
        return ResponseEntity.ok(stats);
    }
}
