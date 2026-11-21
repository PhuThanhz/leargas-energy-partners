package com.leargas.energy.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.leargas.energy.entity.SiteContent;
import com.leargas.energy.repository.SiteContentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class SiteContentService {

    /** Sections the website knows how to render; anything else is rejected. */
    public static final Set<String> SECTIONS = Set.of(
            "navigation", "hero", "marquee", "about", "services",
            "portfolio", "insights", "contact", "footer"
    );

    /** Guard against accidentally huge payloads (e.g. pasted base64 images). */
    private static final int MAX_BYTES = 200_000;

    private final SiteContentRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public Map<String, JsonNode> getAll() {
        Map<String, JsonNode> result = new LinkedHashMap<>();
        for (SiteContent row : repository.findAll()) {
            try {
                result.put(row.getSectionKey(), objectMapper.readTree(row.getData()));
            } catch (JsonProcessingException e) {
                log.warn("Skipping unreadable site content for section {}", row.getSectionKey());
            }
        }
        return result;
    }

    @Transactional
    public JsonNode save(String key, JsonNode data) {
        if (!SECTIONS.contains(key)) {
            throw new IllegalArgumentException("Unknown section: " + key);
        }
        if (data == null || !data.isObject()) {
            throw new IllegalArgumentException("Section content must be a JSON object");
        }
        String json = data.toString();
        if (json.length() > MAX_BYTES) {
            throw new IllegalArgumentException("Section content is too large");
        }
        SiteContent row = repository.findById(key).orElseGet(() -> SiteContent.builder().sectionKey(key).build());
        row.setData(json);
        repository.save(row);
        return data;
    }

    /** Remove the override so the section shows its built-in defaults again. */
    @Transactional
    public void reset(String key) {
        if (!SECTIONS.contains(key)) {
            throw new IllegalArgumentException("Unknown section: " + key);
        }
        repository.deleteById(key);
    }
}
