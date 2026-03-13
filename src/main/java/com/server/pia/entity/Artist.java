package com.server.pia.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "artists")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long artist_id;

    private String name;

    private Double average_rating;

    private Integer total_review_count;

    @OneToMany(mappedBy = "artist")
    @JsonIgnore
    private List<Music> music;

    public Artist() {}

    public Long getArtist_id() { return artist_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}