package com.leargas.energy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Editable content of one public website section (hero, services, footer…), stored as JSON.
 * Sections without a row fall back to the defaults shipped with the frontend.
 */
@Entity
@Table(name = "site_content")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteContent {

    @Id
    @Column(name = "section_key", length = 50)
    private String sectionKey;

    @Column(columnDefinition = "LONGTEXT", nullable = false)
    private String data;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
