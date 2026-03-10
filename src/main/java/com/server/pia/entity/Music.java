package com.server.pia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "music")
public class Music {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long music_id;

    private String name;

    private String description;

    private String genre;

    private Integer length_seconds;

    private String cover_image;

    private Double average_rating;

    private Integer review_count;

    private Integer spotify_id;

    private String created_at;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    public Music() {}

    public Long getMusic_id() { return music_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getSpotify_id() { return spotify_id; }
    public void setSpotify_id(Integer spotify_id) { this.spotify_id = spotify_id; }
}