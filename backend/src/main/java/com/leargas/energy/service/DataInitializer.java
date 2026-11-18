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
            String disclaimer = "<div class=\"article-note\">This introductory guide provides general information. It is not legal, tax, technical or investment advice for a specific project. Transaction requirements should be assessed with appropriately qualified advisers.</div>";

            Post post1 = Post.builder()
                    .title("Buying a wind project: the first questions to ask")
                    .slug("buying-a-wind-project-first-screening")
                    .excerpt("A practical framework for screening a wind energy acquisition before committing to detailed due diligence.")
                    .content("<h2 id=\"investment-mandate\">Start with the investment mandate</h2>\n" +
                            "<p>Before reviewing a wind project, define what a successful investment should achieve. A strong resource or an attractive headline valuation does not, by itself, establish a fit with an investor’s objectives.</p>\n" +
                            "<p>Clarify the target geography, development stage, equity commitment, ownership share, return objectives and investment horizon. These criteria make early conversations more productive and help distinguish a promising opportunity from a distraction.</p>\n" +
                            "<h2 id=\"what-is-being-acquired\">Establish what is being acquired</h2>\n" +
                            "<p>Identify the proposed transaction perimeter: shares in a project company, an interest in a portfolio, or a development platform. Ask who owns the relevant interests, who is authorised to discuss a sale, and which obligations would remain with the buyer.</p>\n" +
                            "<ul>\n" +
                            "<li>What percentage is available, and what governance rights accompany it?</li>\n" +
                            "<li>Which assets, contracts, debt and liabilities sit within the perimeter?</li>\n" +
                            "<li>Are there partner consents, lender approvals or other transfer conditions to investigate?</li>\n" +
                            "</ul>\n" +
                            "<p>Ownership and transfer questions should be reviewed by qualified legal advisers before conclusions are drawn.</p>\n" +
                            "<h2 id=\"stage-and-evidence\">Understand the stage and evidence</h2>\n" +
                            "<p>A development-stage opportunity should be assessed differently from an operating wind farm. For development assets, focus on the evidence behind site access, planning status, permits, grid arrangements and the route to construction. For operating assets, request historical generation, availability, maintenance and financial records.</p>\n" +
                            "<p>Separate confirmed documents from management expectations. A useful screening summary marks each material assumption as verified, pending verification or unavailable.</p>\n" +
                            "<h2 id=\"commercial-fundamentals\">Test the commercial fundamentals</h2>\n" +
                            "<p>Review the revenue arrangements and the assumptions connecting generation to cash flow. Questions may include the applicable offtake terms, payment history, curtailment, operating costs, financing obligations and remaining asset life.</p>\n" +
                            "<p>A valuation should be supported by a financial model and scenarios, rather than a single price-per-megawatt comparison. Downside cases can help identify which assumptions require deeper work.</p>\n" +
                            "<h2 id=\"next-decision\">Set a clear next decision</h2>\n" +
                            "<p>The outcome of screening is a decision about whether to investigate further. Agree the missing information, the specialist advisers needed, confidentiality arrangements and the next decision milestone before allocating significant resources.</p>\n" +
                            "<p>A concise investment screening memo can capture the opportunity, investment fit, unresolved issues and recommended next steps.</p>\n" +
                            disclaimer)
                    .category("Góc nhìn Đầu tư")
                    .author("LÉARGAS Editorial")
                    .readingTimeMinutes(5)
                    .coverImageUrl("/images/wind.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(5))
                    .build();

            Post post2 = Post.builder()
                    .title("Preparing a wind project for a credible sale process")
                    .slug("selling-a-wind-project-market-preparation")
                    .excerpt("How project owners can organise information, define the sale perimeter and prepare for investor engagement.")
                    .content("<h2 id=\"seller-objectives\">Define the seller’s objectives</h2>\n" +
                            "<p>A structured sale starts with an explicit objective. Is the owner seeking a complete exit, a partial divestment or a partner to finance the next development phase? These choices affect the investor universe, information requirements and transaction structure.</p>\n" +
                            "<p>Align shareholders on the desired outcome, timing, acceptable retained exposure and decision-making authority before approaching investors.</p>\n" +
                            "<h2 id=\"project-story\">Organise the project story</h2>\n" +
                            "<p>Prepare a consistent account of the project’s location, technology, capacity, stage, ownership and commercial arrangements. Distinguish completed milestones from planned activities and clearly explain the evidence available for each.</p>\n" +
                            "<p>The strongest presentation is one that investors can verify. Avoid unsupported claims about approvals, returns or guaranteed completion dates.</p>\n" +
                            "<h2 id=\"data-room\">Build an orderly data room</h2>\n" +
                            "<p>Collect and index the documents that support investor review. Depending on the project stage, these may include:</p>\n" +
                            "<ul>\n" +
                            "<li>Corporate structure, shareholding records and shareholder agreements.</li>\n" +
                            "<li>Land or site-access documents, planning records and permits.</li>\n" +
                            "<li>Grid connection and revenue or offtake arrangements.</li>\n" +
                            "<li>Resource assessments, technical reports and key construction or service contracts.</li>\n" +
                            "<li>Financial statements, financing documents and the project financial model.</li>\n" +
                            "</ul>\n" +
                            "<p>Use controlled access and a clear document version history. Counsel should help determine what can be shared, when and with whom.</p>\n" +
                            "<h2 id=\"difficult-questions\">Prepare for difficult questions</h2>\n" +
                            "<p>Investors will seek to understand unresolved matters as well as strengths. Identify missing documentation, contractual constraints, technical issues and disagreements between the financial model and historical performance.</p>\n" +
                            "<p>Where possible, develop an action plan and assign responsibility for each issue. Transparent, consistent responses can reduce avoidable disruption during diligence.</p>\n" +
                            "<h2 id=\"engagement\">Manage engagement with discipline</h2>\n" +
                            "<p>A non-confidential teaser can introduce an opportunity without exposing sensitive project details. Further information should be shared through an agreed process with suitable confidentiality protections.</p>\n" +
                            "<p>Maintain an investor log, a central questions-and-answers register and consistent milestones. Compare offers on structure, conditions and execution requirements as well as headline price.</p>\n" +
                            disclaimer)
                    .category("M&A & Hợp tác Chiến lược")
                    .author("LÉARGAS Editorial")
                    .readingTimeMinutes(5)
                    .coverImageUrl("/images/coastline.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(3))
                    .build();

            Post post3 = Post.builder()
                    .title("Navigating Power Development Plan 8 (PDP8): priorities for investors")
                    .slug("navigating-pdp8-investor-priorities")
                    .excerpt("Understanding regulatory timelines, grid connection approvals, and the transition path to competitive auction frameworks.")
                    .content("<h2 id=\"pdp8-context\">The PDP8 Regulatory Landscape</h2>\n" +
                            "<p>Vietnam’s National Power Development Plan for the 2021–2030 period with a vision to 2050 (PDP8) represents a pivotal shift toward decarbonisation and energy security. For international energy sponsors and institutional lenders, navigating this framework requires understanding how project pipelines transition from master-plan endorsement into bankable execution.</p>\n" +
                            "<p>The implementation plan prioritises onshore, nearshore, and offshore wind capacity, while introducing rigorous timelines to retire non-performing licences and reallocate grid capacity to shovel-ready developments.</p>\n" +
                            "<h2 id=\"grid-connectivity\">Grid connection approvals and curtailment risks</h2>\n" +
                            "<p>Grid integration remains the single most critical gating item for project feasibility in renewable-dense provinces such as Ninh Thuan, Binh Thuan, and Tra Vinh. Investors must conduct forensic grid capacity assessments:</p>\n" +
                            "<ul>\n" +
                            "<li>Reviewing the 500kV and 220kV transmission line commissioning timelines under the National Power Transmission Corporation (EVNNPT).</li>\n" +
                            "<li>Assessing dynamic curtailment risks and potential impact on Levelised Cost of Energy (LCOE).</li>\n" +
                            "<li>Evaluating co-located battery energy storage systems (BESS) as a grid stabiliser and curtailment mitigation strategy.</li>\n" +
                            "</ul>\n" +
                            "<h2 id=\"dppa-mechanisms\">Direct Power Purchase Agreement (DPPA) mechanism</h2>\n" +
                            "<p>The landmark Decree No. 80/2024/ND-CP establishing the Direct Power Purchase Agreement (DPPA) mechanism creates a direct bilateral procurement avenue between renewable energy developers and large power consumers. This allows creditworthy corporate off-takers (such as multinational tech, semiconductor, and manufacturing hubs) to contract clean energy via both physical dedicated lines and virtual contracts-for-difference (CfD) through the national grid.</p>\n" +
                            "<p>Projects structured under DPPA benefit from diversified offtake counterparty risk and currency indexing options that enhance international project finance viability.</p>\n" +
                            "<h2 id=\"auction-transition\">Transition to competitive bidding and FIT sunset</h2>\n" +
                            "<p>With the sunset of historical Feed-in Tariff (FIT) regimes, transitional projects and new wind pipelines must benchmark pricing against the Ministry of Industry and Trade (MOIT) ceiling tariff frameworks. Investors must align financial modelling with tariff negotiation dynamics, commercial operation date (COD) commitments, and EVN power purchase agreement (PPA) standard conditions.</p>\n" +
                            "<h2 id=\"strategic-checklist\">Key priorities for institutional investors</h2>\n" +
                            "<p>Before committing development or acquisition capital, sponsors should execute a four-point verification:</p>\n" +
                            "<ul>\n" +
                            "<li>Verify project inclusion in provincial PDP8 implementation quotas and provincial land-use master plans.</li>\n" +
                            "<li>Confirm environmental impact assessment (EIA) validity and maritime area allocation for offshore wind plots.</li>\n" +
                            "<li>Model downside sensitivity for curtailment, dispatch scheduling, and transmission reinforcement milestones.</li>\n" +
                            "<li>Retain experienced local legal and technical transaction counsel early in the screening phase.</li>\n" +
                            "</ul>\n" +
                            disclaimer)
                    .category("Pháp lý & Quy hoạch PDP8")
                    .author("LÉARGAS Research")
                    .readingTimeMinutes(6)
                    .coverImageUrl("/images/wind.jpg")
                    .status("PUBLISHED")
                    .publishedAt(LocalDateTime.now().minusDays(1))
                    .build();

            postRepository.save(post1);
            postRepository.save(post2);
            postRepository.save(post3);
            log.info("Initial articles seeded into database with comprehensive content.");
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
