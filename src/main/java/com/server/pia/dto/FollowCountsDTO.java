package com.server.pia.dto;

public class FollowCountsDTO {
    private long followingCount;
    private long followersCount;

    public FollowCountsDTO(long followingCount, long followersCount) {
        this.followingCount = followingCount;
        this.followersCount = followersCount;
    }

    public long getFollowingCount() {
        return followingCount;
    }

    public void setFollowingCount(long followingCount) {
        this.followingCount = followingCount;
    }

    public long getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(long followersCount) {
        this.followersCount = followersCount;
    }
}