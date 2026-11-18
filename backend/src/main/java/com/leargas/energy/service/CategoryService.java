package com.leargas.energy.service;

import com.leargas.energy.dto.category.CategoryDto;
import com.leargas.energy.dto.category.CategoryRequest;
import com.leargas.energy.entity.Category;
import com.leargas.energy.exception.ResourceNotFoundException;
import com.leargas.energy.repository.CategoryRepository;
import com.leargas.energy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final PostRepository postRepository;

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAllByOrderByDisplayOrderAsc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDto(category);
    }

    @Transactional
    public CategoryDto createCategory(CategoryRequest request) {
        String slug = request.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = toSlug(request.getName());
        }

        Category category = Category.builder()
                .name(request.getName().trim())
                .slug(slug.trim())
                .description(request.getDescription())
                .color(request.getColor() != null ? request.getColor() : "#1677ff")
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .build();

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    @Transactional
    public CategoryDto updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        category.setName(request.getName().trim());
        if (request.getSlug() != null && !request.getSlug().trim().isEmpty()) {
            category.setSlug(request.getSlug().trim());
        }
        category.setDescription(request.getDescription());
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }
        if (request.getDisplayOrder() != null) {
            category.setDisplayOrder(request.getDisplayOrder());
        }

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDto mapToDto(Category category) {
        long postCount = postRepository.countByCategory(category.getName());
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .color(category.getColor())
                .displayOrder(category.getDisplayOrder())
                .postCount(postCount)
                .createdAt(category.getCreatedAt())
                .build();
    }

    public static String toSlug(String input) {
        if (input == null) return "";
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String noDiacritics = pattern.matcher(normalized).replaceAll("")
                .replace("đ", "d").replace("Đ", "d");
        return noDiacritics.toLowerCase(Locale.ENGLISH)
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }
}
