package com.leargas.energy.dto.enquiry;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEnquiryStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // NEW, CONTACTED, QUALIFIED, CLOSED

    private String notes;
}
