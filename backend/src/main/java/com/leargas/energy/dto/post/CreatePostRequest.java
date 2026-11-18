package com.leargas.energy.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String slug;

    private String excerpt;

    @NotBlank(message = "Content is required")
    private String content;

    private String category;

    private String author;

    private Integer readingTimeMinutes;

    private String coverImageUrl;

    private String status; // DRAFT or PUBLISHED
}
