package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    private String username;

    private String profile_picture;

    private String email;

    private String password;

    private LocalDate created_at;

    private LocalDate birth_date;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Playlist> playlists;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Reviews> reviews;

    public User() {}

    public Long getUserId() { return userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}