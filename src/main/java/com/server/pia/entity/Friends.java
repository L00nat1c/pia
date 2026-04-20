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

    @PrePersist
    protected void onCreate() {
        if (created_at == null) {
            created_at = LocalDate.now();
        }
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "friend_user_id")
    private User friendUser;

    public Friends() {}

    // Getters and Setters
    public Long getFriend_id() {
        return friend_id;
    }

    public void setFriend_id(Long friend_id) {
        this.friend_id = friend_id;
    }

    public LocalDate getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDate created_at) {
        this.created_at = created_at;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getFriendUser() {
        return friendUser;
    }

    public void setFriendUser(User friendUser) {
        this.friendUser = friendUser;
    }
}