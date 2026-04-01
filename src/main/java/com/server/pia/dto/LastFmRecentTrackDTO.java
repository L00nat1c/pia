package com.server.pia.dto;

public class LastFmRecentTrackDTO {

    private String trackName;
    private String artistName;
    private String albumName;
    private String albumImage;
    private String playedAt;
    private boolean nowPlaying;

    public LastFmRecentTrackDTO() {}

    public String getTrackName() { return trackName; }
    public void setTrackName(String trackName) { this.trackName = trackName; }

    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }

    public String getAlbumName() { return albumName; }
    public void setAlbumName(String albumName) { this.albumName = albumName; }

    public String getAlbumImage() { return albumImage; }
    public void setAlbumImage(String albumImage) { this.albumImage = albumImage; }

    public String getPlayedAt() { return playedAt; }
    public void setPlayedAt(String playedAt) { this.playedAt = playedAt; }

    public boolean isNowPlaying() { return nowPlaying; }
    public void setNowPlaying(boolean nowPlaying) { this.nowPlaying = nowPlaying; }
}