package com.server.pia.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "artist")
public class Artist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long artist_id;

    private String name;

    private Double average_rating;

    private Integer total_review_count;

    public Artist() {}

    public Long getArtist_id() { return artist_id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getAverage_rating() { return average_rating; }
    public void setAverage_rating(Double average_rating) { this.average_rating = average_rating; }

    public Integer getTotal_review_count() { return total_review_count; }
    public void setTotal_review_count(Integer total_review_count) { this.total_review_count = total_review_count; }
}