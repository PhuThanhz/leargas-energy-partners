package com.leargas.energy.controller.admin;

import com.fasterxml.jackson.databind.JsonNode;
import com.leargas.energy.service.SiteContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/content")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Site Content", description = "Edit the public website sections")
public class AdminSiteContentController {

    private final SiteContentService siteContentService;

    @GetMapping
    @Operation(summary = "Get edited content for all sections")
    public ResponseEntity<Map<String, JsonNode>> getAll() {
        return ResponseEntity.ok(siteContentService.getAll());
    }

    @PutMapping("/{key}")
    @Operation(summary = "Save the content of one section")
    public ResponseEntity<JsonNode> save(@PathVariable String key, @RequestBody JsonNode data) {
        return ResponseEntity.ok(siteContentService.save(key, data));
    }

    @DeleteMapping("/{key}")
    @Operation(summary = "Reset one section to its built-in defaults")
    public ResponseEntity<Void> reset(@PathVariable String key) {
        siteContentService.reset(key);
        return ResponseEntity.noContent().build();
    }
}
