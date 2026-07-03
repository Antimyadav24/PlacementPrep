package com.placeprep.portal.payload.response;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private String id;
    private String fullName;
    private int totalScore;
    private int testCount;
    private int accuracy;
}
