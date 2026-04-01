package com.server.pia.dto;

public class FriendActivityDTO {

    private Long userId;
    private String username;
    private String profilePicture;
    private String songTitle;
    private String songArtist;
    private String albumName;
    private String albumImage;
    private String reviewDate;
    private Boolean isListeningNow;
    private Integer rating;
    private String reviewText;

    public FriendActivityDTO() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }

    public String getSongTitle() { return songTitle; }
    public void setSongTitle(String songTitle) { this.songTitle = songTitle; }

    public String getSongArtist() { return songArtist; }
    public void setSongArtist(String songArtist) { this.songArtist = songArtist; }

    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }

    public String getAlbumImage() { return albumImage; }
    public void setAlbumImage(String albumImage) { this.albumImage = albumImage; }

    public String getReviewDate() { return reviewDate; }
    public void setReviewDate(String reviewDate) { this.reviewDate = reviewDate; }

    public Boolean getIsListeningNow() { return isListeningNow; }
    public void setIsListeningNow(Boolean isListeningNow) { this.isListeningNow = isListeningNow; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getReviewText() { return reviewText; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
}