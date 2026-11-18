package com.leargas.energy.controller.admin;

import com.leargas.energy.dto.enquiry.EnquiryResponseDto;
import com.leargas.energy.dto.enquiry.UpdateEnquiryStatusRequest;
import com.leargas.energy.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/enquiries")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Enquiries CRM", description = "Endpoints for managing client leads, consultation stages, and notes")
public class AdminEnquiryController {

    private final EnquiryService enquiryService;

    @GetMapping
    @Operation(summary = "Get paginated consultation inquiries, optionally filtered by status")
    public ResponseEntity<Page<EnquiryResponseDto>> getEnquiries(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(enquiryService.getEnquiries(status, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single consultation inquiry details")
    public ResponseEntity<EnquiryResponseDto> getEnquiryById(@PathVariable Long id) {
        return ResponseEntity.ok(enquiryService.getEnquiryById(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update inquiry workflow status and internal notes")
    public ResponseEntity<EnquiryResponseDto> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEnquiryStatusRequest request
    ) {
        return ResponseEntity.ok(enquiryService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an inquiry")
    public ResponseEntity<Void> deleteEnquiry(@PathVariable Long id) {
        enquiryService.deleteEnquiry(id);
        return ResponseEntity.noContent().build();
    }
}
