package com.leargas.energy.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries", indexes = {
    @Index(name = "idx_enquiries_status", columnList = "status"),
    @Index(name = "idx_enquiries_created", columnList = "created_at DESC")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 150)
    private String company;

    @Column(length = 100)
    private String role;

    @Column(nullable = false, length = 100)
    private String topic;

    @Column(name = "project_stage", length = 100)
    private String projectStage;

    @Column(name = "indicative_capacity", length = 100)
    private String indicativeCapacity;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 30)
    @Builder.Default
    private String status = "NEW"; // NEW, CONTACTED, QUALIFIED, CLOSED

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
