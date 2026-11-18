package com.leargas.energy.service;

import com.leargas.energy.dto.post.CreatePostRequest;
import com.leargas.energy.dto.post.PostDetailDto;
import com.leargas.energy.dto.post.PostSummaryDto;
import com.leargas.energy.dto.post.UpdatePostRequest;
import com.leargas.energy.entity.Post;
import com.leargas.energy.exception.ResourceNotFoundException;
import com.leargas.energy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public Page<PostSummaryDto> getPublishedPosts(Pageable pageable) {
        return postRepository.findByStatus("PUBLISHED", pageable)
                .map(this::toSummaryDto);
    }

    @Transactional(readOnly = true)
    public PostDetailDto getPostBySlug(String slug) {
        Post post = postRepository.findBySlugAndStatus(slug, "PUBLISHED")
                .orElseThrow(() -> new ResourceNotFoundException("Published article not found: " + slug));
        return toDetailDto(post);
    }

    @Transactional(readOnly = true)
    public Page<PostSummaryDto> getAllPosts(String category, String status, Pageable pageable) {
        return postRepository.searchPosts(
                (category != null && !category.isBlank()) ? category : null,
                (status != null && !status.isBlank()) ? status : null,
                pageable
        ).map(this::toSummaryDto);
    }

    @Transactional(readOnly = true)
    public PostDetailDto getPostByIdForAdmin(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));
        return toDetailDto(post);
    }

    @Transactional
    public PostDetailDto createPost(CreatePostRequest request) {
        String slug = (request.getSlug() != null && !request.getSlug().isBlank())
                ? generateSlug(request.getSlug())
                : generateSlug(request.getTitle());

        if (postRepository.existsBySlug(slug)) {
            slug = slug + "-" + System.currentTimeMillis();
        }

        String status = (request.getStatus() != null && !request.getStatus().isBlank())
                ? request.getStatus().toUpperCase(Locale.ROOT)
                : "DRAFT";

        LocalDateTime publishedAt = "PUBLISHED".equals(status) ? LocalDateTime.now() : null;

        Post post = Post.builder()
                .title(request.getTitle())
                .slug(slug)
                .excerpt(request.getExcerpt())
                .content(request.getContent())
                .category(request.getCategory() != null ? request.getCategory() : "Investment insights")
                .author(request.getAuthor() != null ? request.getAuthor() : "LÉARGAS Editorial")
                .readingTimeMinutes(request.getReadingTimeMinutes() != null ? request.getReadingTimeMinutes() : calculateReadingTime(request.getContent()))
                .coverImageUrl(request.getCoverImageUrl() != null ? request.getCoverImageUrl() : "/images/wind.jpg")
                .status(status)
                .publishedAt(publishedAt)
                .build();

        Post saved = postRepository.save(post);
        return toDetailDto(saved);
    }

    @Transactional
    public PostDetailDto updatePost(Long id, UpdatePostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article not found with id: " + id));

        post.setTitle(request.getTitle());
        if (request.getSlug() != null && !request.getSlug().isBlank()) {
            post.setSlug(generateSlug(request.getSlug()));
        }
        post.setExcerpt(request.getExcerpt());
        post.setContent(request.getContent());

        if (request.getCategory() != null) post.setCategory(request.getCategory());
        if (request.getAuthor() != null) post.setAuthor(request.getAuthor());
        if (request.getCoverImageUrl() != null) post.setCoverImageUrl(request.getCoverImageUrl());
        if (request.getReadingTimeMinutes() != null) {
            post.setReadingTimeMinutes(request.getReadingTimeMinutes());
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String newStatus = request.getStatus().toUpperCase(Locale.ROOT);
            if ("PUBLISHED".equals(newStatus) && !"PUBLISHED".equals(post.getStatus())) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(newStatus);
        }

        Post updated = postRepository.save(post);
        return toDetailDto(updated);
    }

    @Transactional
    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article not found with id: " + id);
        }
        postRepository.deleteById(id);
    }

    public PostSummaryDto toSummaryDto(Post post) {
        return PostSummaryDto.builder()
                .id(post.getId())
                .slug(post.getSlug())
                .title(post.getTitle())
                .excerpt(post.getExcerpt())
                .category(post.getCategory())
                .author(post.getAuthor())
                .readingTimeMinutes(post.getReadingTimeMinutes())
                .coverImageUrl(post.getCoverImageUrl())
                .status(post.getStatus())
                .publishedAt(post.getPublishedAt() != null
                        ? post.getPublishedAt().format(DateTimeFormatter.ISO_LOCAL_DATE)
                        : null)
                .build();
    }

    public PostDetailDto toDetailDto(Post post) {
        return PostDetailDto.builder()
                .id(post.getId())
                .slug(post.getSlug())
                .title(post.getTitle())
                .excerpt(post.getExcerpt())
                .content(post.getContent())
                .category(post.getCategory())
                .author(post.getAuthor())
                .readingTimeMinutes(post.getReadingTimeMinutes())
                .coverImageUrl(post.getCoverImageUrl())
                .status(post.getStatus())
                .publishedAt(post.getPublishedAt() != null
                        ? post.getPublishedAt().format(DateTimeFormatter.ISO_LOCAL_DATE)
                        : null)
                .updatedAt(post.getUpdatedAt() != null
                        ? post.getUpdatedAt().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)
                        : null)
                .build();
    }

    private String generateSlug(String input) {
        if (input == null) return "";
        return input.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    private int calculateReadingTime(String content) {
        if (content == null || content.isBlank()) return 3;
        int wordCount = content.split("\\s+").length;
        return Math.max(1, (int) Math.ceil((double) wordCount / 200));
    }
}
