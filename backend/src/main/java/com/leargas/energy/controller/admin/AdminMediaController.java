package com.leargas.energy.controller.admin;

import com.leargas.energy.dto.media.MediaDto;
import com.leargas.energy.entity.MediaFile;
import com.leargas.energy.exception.ResourceNotFoundException;
import com.leargas.energy.repository.MediaFileRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/admin/media")
@RequiredArgsConstructor
@Tag(name = "Admin Media", description = "Admin media file and image upload APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminMediaController {

    private final MediaFileRepository mediaFileRepository;

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image/media file")
    public ResponseEntity<MediaDto> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File upload cannot be empty");
        }

        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "upload.png";
        String cleanName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String uniqueFileName = UUID.randomUUID().toString().substring(0, 8) + "_" + cleanName;

        Path targetLocation = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = "/uploads/" + uniqueFileName;

        MediaFile mediaFile = MediaFile.builder()
                .fileName(originalFilename)
                .filePath(fileUrl)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .build();

        MediaFile saved = mediaFileRepository.save(mediaFile);

        MediaDto dto = MediaDto.builder()
                .id(saved.getId())
                .fileName(saved.getFileName())
                .url(fileUrl)
                .fileType(saved.getFileType())
                .fileSize(saved.getFileSize())
                .createdAt(saved.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping
    @Operation(summary = "List all uploaded media files")
    public ResponseEntity<List<MediaDto>> getAllMedia() {
        List<MediaDto> list = mediaFileRepository.findAll().stream()
                .map(m -> MediaDto.builder()
                        .id(m.getId())
                        .fileName(m.getFileName())
                        .url(m.getFilePath())
                        .fileType(m.getFileType())
                        .fileSize(m.getFileSize())
                        .createdAt(m.getCreatedAt())
                        .build())
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete media file")
    public ResponseEntity<Void> deleteMedia(@PathVariable Long id) {
        MediaFile mediaFile = mediaFileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Media file not found with id: " + id));

        try {
            Path filePath = Paths.get(uploadDir).resolve(Paths.get(mediaFile.getFilePath()).getFileName()).toAbsolutePath().normalize();
            Files.deleteIfExists(filePath);
        } catch (Exception ex) {
            log.warn("Could not delete physical file: {}", ex.getMessage());
        }

        mediaFileRepository.delete(mediaFile);
        return ResponseEntity.noContent().build();
    }
}
