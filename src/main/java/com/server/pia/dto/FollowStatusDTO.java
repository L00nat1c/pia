package com.server.pia.dto;

public class FollowStatusDTO {
    private boolean isFollowing;

    public FollowStatusDTO(boolean isFollowing) {
        this.isFollowing = isFollowing;
    }

    public boolean isFollowing() {
        return isFollowing;
    }

    public void setFollowing(boolean following) {
        isFollowing = following;
    }
}