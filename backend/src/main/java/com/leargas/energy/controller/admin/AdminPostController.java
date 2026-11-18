package com.leargas.energy.controller.admin;

import com.leargas.energy.dto.post.CreatePostRequest;
import com.leargas.energy.dto.post.PostDetailDto;
import com.leargas.energy.dto.post.PostSummaryDto;
import com.leargas.energy.dto.post.UpdatePostRequest;
import com.leargas.energy.service.PostService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/posts")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Posts CMS", description = "Endpoints for managing articles, drafts, and publication states")
public class AdminPostController {

    private final PostService postService;

    @GetMapping
    @Operation(summary = "Get all articles with filters (drafts & published)")
    public ResponseEntity<Page<PostSummaryDto>> getAllPosts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(postService.getAllPosts(category, status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full article details by ID for editing")
    public ResponseEntity<PostDetailDto> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostByIdForAdmin(id));
    }

    @PostMapping
    @Operation(summary = "Create a new article (draft or published)")
    public ResponseEntity<PostDetailDto> createPost(@Valid @RequestBody CreatePostRequest request) {
        PostDetailDto created = postService.createPost(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing article")
    public ResponseEntity<PostDetailDto> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequest request
    ) {
        return ResponseEntity.ok(postService.updatePost(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an article")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.noContent().build();
    }
}
