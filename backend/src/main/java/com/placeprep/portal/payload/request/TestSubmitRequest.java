package com.placeprep.portal.payload.request;

import lombok.Data;

@Data
public class TestSubmitRequest {
    private String moduleType;
    private String category;
    private int score;
    private int totalQuestions;
    private String email;
    private String fullName;
}
