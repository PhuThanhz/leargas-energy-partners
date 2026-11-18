package com.leargas.energy.controller.admin;

import com.leargas.energy.dto.dashboard.DashboardStatsDto;
import com.leargas.energy.service.EnquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Dashboard", description = "Endpoints for aggregate metrics and system overview")
public class AdminDashboardController {

    private final EnquiryService enquiryService;

    @GetMapping("/stats")
    @Operation(summary = "Get high-level dashboard metrics (posts, enquiries, statuses)")
    public ResponseEntity<DashboardStatsDto> getStats() {
        return ResponseEntity.ok(enquiryService.getDashboardStats());
    }
}
