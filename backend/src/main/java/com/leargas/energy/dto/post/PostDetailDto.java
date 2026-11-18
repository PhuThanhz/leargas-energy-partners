package com.leargas.energy.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailDto {

    private Long id;
    private String slug;
    private String title;
    private String excerpt;
    private String content;
    private String category;
    private String author;
    private Integer readingTimeMinutes;
    private String coverImageUrl;
    private String status;
    private String publishedAt;
    private String updatedAt;
}
