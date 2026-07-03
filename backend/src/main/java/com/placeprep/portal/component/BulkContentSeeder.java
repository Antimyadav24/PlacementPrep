package com.placeprep.portal.component;

import com.placeprep.portal.models.*;
import com.placeprep.portal.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class BulkContentSeeder {

    @Autowired CodingProblemRepository codingProblemRepository;
    @Autowired InterviewResourceRepository interviewResourceRepository;
    @Autowired StudyMaterialRepository studyMaterialRepository;
    @Autowired AnnouncementRepository announcementRepository;

    private static final String[] DSA_TOPICS = {"Arrays", "Linked Lists", "Dynamic Programming", "Stack/Queue", "Trees", "Graphs", "Greedy", "Backtracking"};
    private static final String[] DIFFICULTIES = {"Easy", "Medium", "Hard"};
    private static final String[] COMPANIES = {"Google", "Amazon", "Microsoft", "TCS", "Meta", "Apple", "Flipkart", "Adobe"};

    public void seedCodingIfNeeded() {
        if (codingProblemRepository.count() >= 1000) {
            // Check if the first problem has a titleSlug. If not, we need to reseed.
            CodingProblem first = codingProblemRepository.findAll().stream().findFirst().orElse(null);
            if (first != null && first.getTitleSlug() != null && !first.getTitleSlug().isEmpty()) {
                return;
            }
        }
        
        System.out.println("Clearing old problems and starting background thread to fetch 1000 coding problems from ALFA LeetCode API...");
        
        new Thread(() -> {
            try {
                codingProblemRepository.deleteAll();
                
                org.springframework.web.client.RestTemplate restTemplate = new org.springframework.web.client.RestTemplate();
                int totalSeeded = 0;
                
                // Fetch 10 pages of 100 questions each
                for (int skip = 0; skip < 1000; skip += 100) {
                    System.out.println("Fetching coding problems from API (skip=" + skip + ")...");
                    String url = "https://alfa-leetcode-api.onrender.com/problems?limit=100&skip=" + skip;
                    java.util.Map response = restTemplate.getForObject(url, java.util.Map.class);
                    
                    if (response != null && response.containsKey("problemsetQuestionList")) {
                        List<java.util.Map<String, Object>> questions = (List<java.util.Map<String, Object>>) response.get("problemsetQuestionList");
                        if (questions == null || questions.isEmpty()) break;
                        
                        List<CodingProblem> problemsToSave = new ArrayList<>();
                        for (java.util.Map<String, Object> q : questions) {
                            CodingProblem problem = new CodingProblem();
                            problem.setTitle((String) q.get("title"));
                            problem.setDifficulty((String) q.get("difficulty"));
                            problem.setTitleSlug((String) q.get("titleSlug"));
                            
                            List<java.util.Map<String, Object>> tagsList = (List<java.util.Map<String, Object>>) q.get("topicTags");
                            if (tagsList != null && !tagsList.isEmpty()) {
                                StringBuilder tags = new StringBuilder();
                                for (int i = 0; i < tagsList.size(); i++) {
                                    tags.append(tagsList.get(i).get("name"));
                                    if (i < tagsList.size() - 1) {
                                        tags.append(", ");
                                    }
                                }
                                problem.setTopic(tags.toString());
                            } else {
                                problem.setTopic("Algorithms");
                            }
                            
                            problem.setDescription("Detailed description for " + problem.getTitle() + " is currently unavailable. Please refer to LeetCode.");
                            problem.setCompanyTags("");
                            problem.setExplanation("Explanation not available.");
                            problem.setSolutionCode("// Solution code goes here");
                            
                            problemsToSave.add(problem);
                        }
                        
                        codingProblemRepository.saveAll(problemsToSave);
                        totalSeeded += problemsToSave.size();
                        System.out.println("Successfully seeded " + totalSeeded + " / 1000 coding problems.");
                    }
                }
                System.out.println("Finished seeding 1000 coding problems from API!");
            } catch (Exception e) {
                System.err.println("Failed to seed coding problems: " + e.getMessage());
            }
        }).start();
    }

    public void seedInterviewIfNeeded() {
        if (interviewResourceRepository.count() >= 100) return;
        interviewResourceRepository.deleteAll();
        List<InterviewResource> resources = new ArrayList<>();
        String[] categories = {"HR", "TECHNICAL", "RESUME", "EXPERIENCE"};
        for (int i = 1; i <= 100; i++) {
            String cat = categories[i % categories.length];
            resources.add(new InterviewResource(
                cat,
                cat + " Interview Guide #" + i,
                "Comprehensive " + cat.toLowerCase() + " preparation content for placement interviews. Topic " + i + " covers essential concepts and sample answers.",
                COMPANIES[i % COMPANIES.length],
                "PlacePrep Team"
            ));
        }
        interviewResourceRepository.saveAll(resources);
    }

    public void seedResourcesIfNeeded() {
        if (studyMaterialRepository.count() >= 50) return;
        studyMaterialRepository.deleteAll();
        List<StudyMaterial> materials = new ArrayList<>();

        materials.add(new StudyMaterial("Aptitude Formula Sheet", "PDF", "", "Complete quantitative aptitude formulas and shortcuts.", "quantitative"));
        materials.add(new StudyMaterial("Java Interview Cheatsheet", "PDF", "", "Core Java concepts for technical rounds.", "core-java"));
        materials.add(new StudyMaterial("DSA Masterclass", "VIDEO", "https://www.youtube.com/embed/dQw4w9WgXcQ", "Complete DSA video course.", "data-structures"));
        materials.add(new StudyMaterial("Full Stack Developer Roadmap", "ROADMAP", "", "Step-by-step roadmap from beginner to job-ready.", "general"));
        materials.add(new StudyMaterial("Fresher Resume Template", "RESUME", "", "ATS-friendly resume template for engineering graduates.", "general"));
        materials.add(new StudyMaterial("Striver DSA Sheet", "DSA_SHEET", "", "Curated 191 DSA problems with difficulty progression.", "data-structures"));
        materials.add(new StudyMaterial("DBMS Interview Notes", "INTERVIEW_NOTES", "", "Normalization, indexing, transactions explained.", "dbms"));
        materials.add(new StudyMaterial("Logical Reasoning Workbook", "APTITUDE_PDF", "", "200+ logical reasoning practice problems.", "logical-reasoning"));

        String[] cats = {"quantitative", "logical-reasoning", "verbal-ability", "core-java", "dbms", "operating-systems", "data-structures"};
        for (int i = 0; i < 30; i++) {
            String cat = cats[i % cats.length];
            materials.add(new StudyMaterial(
                "Study Guide: " + cat + " #" + (i + 1),
                i % 3 == 0 ? "PDF" : i % 3 == 1 ? "VIDEO" : "ARTICLE",
                i % 3 == 1 ? "https://www.youtube.com/embed/dQw4w9WgXcQ" : "",
                "Detailed study material for " + cat.replace("-", " ") + " preparation.",
                cat
            ));
        }
        studyMaterialRepository.saveAll(materials);
    }

    public void seedAnnouncementsIfNeeded() {
        if (announcementRepository.count() > 0) return;
        announcementRepository.save(new Announcement("Welcome to PlacePrep Portal", "Your complete placement preparation platform is live. Start with Practice Learn Mode!", "SUCCESS"));
        announcementRepository.save(new Announcement("New Mock Tests Available", "TCS NQT and Google-style mock tests are now available in the Mock Test section.", "INFO"));
        announcementRepository.save(new Announcement("500+ Questions Added", "We've added 1000+ aptitude and technical MCQs. Happy practicing!", "INFO"));
    }
}
