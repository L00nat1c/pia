package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Reviews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long review_id;

    private Integer rating;

    private String review_text;

    private LocalDate review_date;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "music_id")
    private Music music;

    public Reviews() {}
}