package com.leargas.energy.dto.post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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

    /** #RRGGBB, or empty to reset to the site default. */
    @Pattern(regexp = "^(#[0-9a-fA-F]{6})?$", message = "Background color must be #RRGGBB")
    private String backgroundColor;

    private String status; // DRAFT or PUBLISHED
}
