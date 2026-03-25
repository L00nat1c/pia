package com.server.pia.dto;

public class DeezerTrackDTO {

    private String title;
    private String artist;
    private String album;
    private String previewUrl;

    public DeezerTrackDTO(String title, String artist, String album, String previewUrl) {
        this.title = title;
        this.artist = artist;
        this.album = album;
        this.previewUrl = previewUrl;
    }

    // getters
    public String getTitle() { return title; }
    public String getArtist() { return artist; }
    public String getAlbum() { return album; }
    public String getPreviewUrl() { return previewUrl; }
}