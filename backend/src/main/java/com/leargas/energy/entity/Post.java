package com.leargas.energy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_posts_slug", columnList = "slug"),
    @Index(name = "idx_posts_status_published", columnList = "status, published_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String slug;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String excerpt;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String content;

    @Column(nullable = false, length = 100)
    @Builder.Default
    private String category = "Investment insights";

    @Column(length = 100)
    @Builder.Default
    private String author = "LÉARGAS Editorial";

    @Column(name = "reading_time_minutes")
    @Builder.Default
    private Integer readingTimeMinutes = 5;

    @Column(name = "cover_image_url", length = 500)
    @Builder.Default
    private String coverImageUrl = "/images/wind.jpg";

    /** Reading-area background for this article (#RRGGBB); null = site default. */
    @Column(name = "background_color", length = 7)
    private String backgroundColor;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, PUBLISHED, ARCHIVED

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
