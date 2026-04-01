package com.server.pia.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "friends")
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long friend_id;

    private LocalDate created_at;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_user_id")
    private User friendUser;

    public Friends() {}

    public Long getFriendId() { return friend_id; }

    public LocalDate getCreatedAt() { return created_at; }

    public User getUser() { return user; }

    public User getFriendUser() { return friendUser; }
}