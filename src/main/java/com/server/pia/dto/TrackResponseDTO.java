package com.server.pia.dto;

import java.util.List;

public class TrackResponseDTO {

    private Long id;
    private String name;
    private String artist;

    private String coverImage;
    private String previewUrl;

    private Integer duration;
    private Long playcount;

    private List<String> tags;
    private String genre;

    public TrackResponseDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getCoverImage() { return coverImage; }
    public void setCoverImage(String coverImage) { this.coverImage = coverImage; }

    public String getPreviewUrl() { return previewUrl; }
    public void setPreviewUrl(String previewUrl) { this.previewUrl = previewUrl; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public Long getPlaycount() { return playcount; }
    public void setPlaycount(Long playcount) { this.playcount = playcount; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }
}