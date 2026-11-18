package com.leargas.energy.dto.media;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaDto {
    private Long id;
    private String fileName;
    private String url;
    private String fileType;
    private Long fileSize;
    private LocalDateTime createdAt;
}
