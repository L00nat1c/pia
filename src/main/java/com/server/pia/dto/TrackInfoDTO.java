package com.server.pia.dto;

import java.util.List;

public class TrackInfoDTO {

    private String name;
    private String artist;
    private long playcount;
    private List<String> tags;

    public TrackInfoDTO(String name, String artist, long playcount, List<String> tags) {
        this.name = name;
        this.artist = artist;
        this.playcount = playcount;
        this.tags = tags;
    }

    // Getters + setters
    public String getName() { return name; }
    public String getArtist() { return artist; }
    public long getPlaycount() { return playcount; }
    public List<String> getTags() { return tags; }
}