package com.leargas.energy.service;

import com.leargas.energy.entity.Enquiry;
import com.leargas.energy.entity.Post;
import com.leargas.energy.entity.User;
import com.leargas.energy.repository.EnquiryRepository;
import com.leargas.energy.repository.PostRepository;
import com.leargas.energy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final EnquiryRepository enquiryRepository;
    private final com.leargas.energy.repository.CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedCategories();
        seedPosts();
        seedEnquiries();
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            java.util.List<com.leargas.energy.entity.Category> defaults = java.util.List.of(
                    com.leargas.energy.entity.Category.builder()
                            .name("Góc nhìn Đầu tư")
                            .slug("investment-insights")
                            .description("Phân tích vĩ mô, chiến lược thoái vốn và sinh lời dự án năng lượng tái tạo")
                            .color("#1677ff")
                            .displayOrder(1)
                            .build(),
                    com.leargas.energy.entity.Category.builder()
                            .name("M&A & Hợp tác Chiến lược")
                            .slug("ma-strategic-partnership")
                            .description("Thẩm định kỹ thuật, cơ cấu giao dịch M&A và kết nối dòng vốn quốc tế")
                            .color("#52c41a")
                            .displayOrder(2)
                            .build(),
                    com.leargas.energy.entity.Category.builder()
                            .name("Pháp lý & Quy hoạch PDP8")
                            .slug("legal-pdp8")
                            .description("Cập nhật quy chế đầu tư, phê duyệt lưới điện và chính sách giá mua điện FIT/DPPA")
                            .color("#722ed1")
                            .displayOrder(3)
                            .build(),
                    com.leargas.energy.entity.Category.builder()
                            .name("Thi công & Triển khai")
                            .slug("construction-delivery")
                            .description("Quản trị rủi ro tổng thầu EPC, tiến độ COD và vận hành thương mại")
                            .color("#fa8c16")
                            .displayOrder(4)
                            .build(),
                    com.leargas.energy.entity.Category.builder()
                            .name("Tài chính Xanh & ESG")
                            .slug("green-finance-esg")
                            .description("Trái phiếu xanh, tín chỉ carbon và bộ tiêu chuẩn tài chính bền vững quốc tế")
                            .color("#13c2c2")
                            .displayOrder(5)
                            .build()
            );
            categoryRepository.saveAll(defaults);
            log.info("Default categories seeded ({} items)", defaults.size());
        }
    }

    private void seedAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@leargasenergy.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .fullName("LÉARGAS Administrator")
                    .role("ROLE_ADMIN")
                    .isActive(true)
                    .build();
            userRepository.save(admin);
            log.info("Default administrator seeded: username 'admin', password 'admin123'");
        }
    }

    private void seedPosts() {
        if (postRepository.count() == 0) {
            Post post1 = Post.builder()
                    .title("Buying a wind project: the first questions to ask")
                    .slug("buying-a-wind-project-first-screening")
                    .excerpt("A practical framework for screening a wind energy acquisition before committing to detailed due diligence.")
                    .content("<h2 id=\"investment-mandate\">Start with the investment mandate</h2><p>Before reviewing a wind project, define what a successful investment should achieve. Clarify target geography, development stage, and equity commitment.</p>")
                    .category("Investment insights")
                    .author("LÉARGAS Editorial")
                    .readingTimeMinutes(5)
                    .coverImageUrl("/images/wind.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(5))
                    .build();

            Post post2 = Post.builder()
                    .title("Selling a wind project: preparing before you approach the market")
                    .slug("selling-a-wind-project-market-preparation")
                    .excerpt("Why transaction readiness determines pricing and speed of execution for renewable energy developers in Southeast Asia.")
                    .content("<h2 id=\"seller-perspective\">Prepare the perimeter early</h2><p>Clean corporate documentation and verified site access are the two strongest levers for valuation preservation.</p>")
                    .category("M&A & Partnerships")
                    .author("LÉARGAS Editorial")
                    .readingTimeMinutes(4)
                    .coverImageUrl("/images/wind.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(3))
                    .build();

            Post post3 = Post.builder()
                    .title("Navigating Power Development Plan 8 (PDP8): priorities for investors")
                    .slug("navigating-pdp8-investor-priorities")
                    .excerpt("Understanding regulatory timelines, grid connection approvals, and the transition path to competitive auction frameworks.")
                    .content("<h2 id=\"pdp8-roadmap\">The PDP8 Implementation Plan</h2><p>Detailed analysis of provincial allocation, grid reinforcement milestones, and DPPA direct power purchase mechanisms.</p>")
                    .category("Regulatory & PDP8")
                    .author("LÉARGAS Research")
                    .readingTimeMinutes(6)
                    .coverImageUrl("/images/wind.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(1))
                    .build();

            postRepository.save(post1);
            postRepository.save(post2);
            postRepository.save(post3);
            log.info("Initial articles seeded into database.");
        }
    }

    private void seedEnquiries() {
        if (enquiryRepository.count() == 0) {
            Enquiry enquiry1 = Enquiry.builder()
                    .name("Alexander Wright")
                    .email("a.wright@nordicrenewables.com")
                    .company("Nordic Clean Energy Capital")
                    .role("Head of Asia-Pacific Infrastructure")
                    .topic("M&A / Equity Investment")
                    .projectStage("Operating / Late-stage")
                    .indicativeCapacity("150 - 300 MW")
                    .message("We are evaluating a secondary portfolio acquisition in South Central Vietnam and would like to retain LÉARGAS for commercial and regulatory advisory.")
                    .status("NEW")
                    .notes("High-priority institutional LP fund. Follow up via email within 24h.")
                    .build();

            Enquiry enquiry2 = Enquiry.builder()
                    .name("Nguyen Hoang Minh")
                    .email("minh.nh@vietnamenergycorp.vn")
                    .company("VEC Power Holdings")
                    .role("Investment Director")
                    .topic("Project Delivery & Construction")
                    .projectStage("Pre-construction / PDP8 Implementation")
                    .indicativeCapacity("80 MW Onshore")
                    .message("Seeking strategic equity partner and international EPC structuring for our Gia Lai wind pipeline under DPPA pilot.")
                    .status("CONTACTED")
                    .notes("Met at Vietnam Clean Energy Summit. NDA sent.")
                    .build();

            enquiryRepository.save(enquiry1);
            enquiryRepository.save(enquiry2);
            log.info("Initial demo CRM enquiries seeded.");
        }
    }
}
