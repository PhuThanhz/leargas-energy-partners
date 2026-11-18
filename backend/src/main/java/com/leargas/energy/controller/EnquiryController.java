package com.leargas.energy.controller;

import com.leargas.energy.dto.enquiry.EnquiryCreateRequest;
import com.leargas.energy.dto.enquiry.EnquiryResponseDto;
import com.leargas.energy.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
@Tag(name = "Public Consultations", description = "Endpoint for submitting investor & developer enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    @PostMapping
    @Operation(summary = "Submit a partnership or advisory consultation request")
    public ResponseEntity<EnquiryResponseDto> createEnquiry(@Valid @RequestBody EnquiryCreateRequest request) {
        EnquiryResponseDto created = enquiryService.createEnquiry(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
