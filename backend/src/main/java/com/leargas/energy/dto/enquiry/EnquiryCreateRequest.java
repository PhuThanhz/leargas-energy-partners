package com.leargas.energy.dto.enquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryCreateRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    private String company;

    private String role;

    @NotBlank(message = "Topic is required")
    private String topic;

    private String projectStage;

    private String indicativeCapacity;

    @NotBlank(message = "Message is required")
    private String message;
}
