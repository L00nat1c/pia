package com.server.pia.dto;

public class TrackRequestDTO {

    private String artist;
    private String track;

    public String getArtist() {
        return artist;
    }

    public String getTrack() {
        return track;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public void setTrack(String track) {
        this.track = track;
    }
}