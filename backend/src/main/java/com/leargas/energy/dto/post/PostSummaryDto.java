package com.leargas.energy.dto.post;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostSummaryDto {

    private Long id;
    private String slug;
    private String title;
    private String excerpt;
    private String category;
    private String author;
    private Integer readingTimeMinutes;
    private String coverImageUrl;
    private String publishedAt;
    private String status;

    public static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;
}
