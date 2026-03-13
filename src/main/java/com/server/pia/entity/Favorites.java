package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "favorites")
public class Favorites {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    @Column(name = "added_at")
    private LocalDate addedAt;

    @ManyToOne
    @JoinColumn(name = "music_id")
    private Music music;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Favorites() {}

    public Long getFavoriteId() { return favoriteId; }
    public User getUser() { return user; }
    public Music getMusic() { return music; }
}