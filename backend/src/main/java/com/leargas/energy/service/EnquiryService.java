package com.leargas.energy.service;

import com.leargas.energy.dto.dashboard.DashboardStatsDto;
import com.leargas.energy.dto.enquiry.EnquiryCreateRequest;
import com.leargas.energy.dto.enquiry.EnquiryResponseDto;
import com.leargas.energy.dto.enquiry.UpdateEnquiryStatusRequest;
import com.leargas.energy.entity.Enquiry;
import com.leargas.energy.exception.ResourceNotFoundException;
import com.leargas.energy.repository.EnquiryRepository;
import com.leargas.energy.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;
    private final PostRepository postRepository;

    @Transactional
    public EnquiryResponseDto createEnquiry(EnquiryCreateRequest request) {
        Enquiry enquiry = Enquiry.builder()
                .name(request.getName())
                .email(request.getEmail())
                .company(request.getCompany())
                .role(request.getRole())
                .topic(request.getTopic())
                .projectStage(request.getProjectStage())
                .indicativeCapacity(request.getIndicativeCapacity())
                .message(request.getMessage())
                .status("NEW")
                .build();

        Enquiry saved = enquiryRepository.save(enquiry);
        log.info("New enquiry saved: ID {} from {}", saved.getId(), saved.getEmail());
        return toDto(saved);
    }

    @Transactional(readOnly = true)
    public Page<EnquiryResponseDto> getEnquiries(String status, Pageable pageable) {
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            return enquiryRepository.findByStatus(status.toUpperCase(Locale.ROOT), pageable).map(this::toDto);
        }
        return enquiryRepository.findAll(pageable).map(this::toDto);
    }

    @Transactional(readOnly = true)
    public EnquiryResponseDto getEnquiryById(Long id) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));
        return toDto(enquiry);
    }

    @Transactional
    public EnquiryResponseDto updateStatus(Long id, UpdateEnquiryStatusRequest request) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found with id: " + id));

        enquiry.setStatus(request.getStatus().toUpperCase(Locale.ROOT));
        if (request.getNotes() != null) {
            enquiry.setNotes(request.getNotes());
        }

        Enquiry updated = enquiryRepository.save(enquiry);
        return toDto(updated);
    }

    @Transactional
    public void deleteEnquiry(Long id) {
        if (!enquiryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enquiry not found with id: " + id);
        }
        enquiryRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        long totalPosts = postRepository.count();
        long publishedPosts = postRepository.countByStatus("PUBLISHED");
        long draftPosts = postRepository.countByStatus("DRAFT");

        long totalEnquiries = enquiryRepository.count();
        long newEnquiries = enquiryRepository.countByStatus("NEW");
        long contactedEnquiries = enquiryRepository.countByStatus("CONTACTED");
        long qualifiedEnquiries = enquiryRepository.countByStatus("QUALIFIED");

        return DashboardStatsDto.builder()
                .totalPosts(totalPosts)
                .publishedPosts(publishedPosts)
                .draftPosts(draftPosts)
                .totalEnquiries(totalEnquiries)
                .newEnquiries(newEnquiries)
                .contactedEnquiries(contactedEnquiries)
                .qualifiedEnquiries(qualifiedEnquiries)
                .build();
    }

    public EnquiryResponseDto toDto(Enquiry enquiry) {
        return EnquiryResponseDto.builder()
                .id(enquiry.getId())
                .name(enquiry.getName())
                .email(enquiry.getEmail())
                .company(enquiry.getCompany())
                .role(enquiry.getRole())
                .topic(enquiry.getTopic())
                .projectStage(enquiry.getProjectStage())
                .indicativeCapacity(enquiry.getIndicativeCapacity())
                .message(enquiry.getMessage())
                .status(enquiry.getStatus())
                .notes(enquiry.getNotes())
                .createdAt(enquiry.getCreatedAt())
                .updatedAt(enquiry.getUpdatedAt())
                .build();
    }
}
