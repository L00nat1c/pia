package com.server.pia.dto;

public class FollowStatusDTO {

    private boolean following;

    public FollowStatusDTO() {}

    public FollowStatusDTO(boolean following) {
        this.following = following;
    }

    public boolean isFollowing() { return following; }
    public void setFollowing(boolean following) { this.following = following; }
}
