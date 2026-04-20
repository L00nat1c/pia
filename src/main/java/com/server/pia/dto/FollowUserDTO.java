package com.server.pia.dto;

public class FollowUserDTO {

    private Long userId;
    private String username;
    private String profilePicture;
    private String bio;

    public FollowUserDTO() {}

    public FollowUserDTO(Long userId, String username, String profilePicture, String bio) {
        this.userId = userId;
        this.username = username;
        this.profilePicture = profilePicture;
        this.bio = bio;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}