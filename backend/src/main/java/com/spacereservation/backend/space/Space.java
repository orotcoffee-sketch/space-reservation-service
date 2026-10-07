package com.spacereservation.backend.space;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "space")
public class Space {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private int capacity;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Space() {
    }

    public Space(String name, String description, String location, int capacity, String imageUrl) {
        update(name, description, location, capacity, imageUrl);
        this.active = true;
    }

    public void update(String name, String description, String location, int capacity, String imageUrl) {
        this.name = name;
        this.description = description;
        this.location = location;
        this.capacity = capacity;
        this.imageUrl = imageUrl;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getLocation() {
        return location;
    }

    public int getCapacity() {
        return capacity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public boolean isActive() {
        return active;
    }
}
