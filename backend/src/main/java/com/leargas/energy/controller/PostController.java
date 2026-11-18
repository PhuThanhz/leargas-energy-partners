package com.leargas.energy.controller;

import com.leargas.energy.dto.post.PostDetailDto;
import com.leargas.energy.dto.post.PostSummaryDto;
import com.leargas.energy.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@Tag(name = "Public Blog Posts", description = "Endpoints for reading published articles and insights")
public class PostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Get paginated published articles")
    public ResponseEntity<Page<PostSummaryDto>> getPosts(
            @PageableDefault(size = 12, sort = "publishedAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getPublishedPosts(pageable));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get published article details by slug")
    public ResponseEntity<PostDetailDto> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(postService.getPostBySlug(slug));
    }
}
