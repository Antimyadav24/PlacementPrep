package com.placeprep.portal.payload.response;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String fullName;
    private String email;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String fullName, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.roles = roles;
    }
}
