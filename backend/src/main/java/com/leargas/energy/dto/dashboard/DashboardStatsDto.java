package com.leargas.energy.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {

    private long totalPosts;
    private long publishedPosts;
    private long draftPosts;
    private long totalEnquiries;
    private long newEnquiries;
    private long contactedEnquiries;
    private long qualifiedEnquiries;
}
