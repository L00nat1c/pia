package com.server.pia.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    private String spotify_id;

    private String created_at;

    @ManyToOne
    @JoinColumn(name = "artist_id")
    private Artist artist;

    @OneToMany(mappedBy = "music")
    @JsonIgnore
    private List<Reviews> reviews;

    public Music() {}

    public Long getMusic_id() { return music_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}