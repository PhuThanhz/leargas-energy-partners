package com.leargas.energy.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.leargas.energy.service.SiteContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/content")
@RequiredArgsConstructor
@Tag(name = "Site Content", description = "Public website copy and images managed from the admin")
public class SiteContentController {

    private final SiteContentService siteContentService;

    @GetMapping
    @Operation(summary = "Get edited content for all website sections")
    public ResponseEntity<Map<String, JsonNode>> getAll() {
        return ResponseEntity.ok(siteContentService.getAll());
    }
}
