package com.leargas.energy.dto.category;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {
    @NotBlank(message = "Tên chuyên mục không được để trống")
    private String name;

    private String slug;

    private String description;

    private String color;

    private Integer displayOrder;
}
