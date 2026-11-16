import type { Post } from "@/types"

/**
 * Phase-1 articles. Served by `src/lib/api/blog.ts` while `API_BASE_URL`
 * is not configured; once the Spring Boot API is live these are ignored.
 */

const disclaimer = `<div class="article-note">This introductory guide provides general information. It is not legal, tax, technical or investment advice for a specific project. Transaction requirements should be assessed with appropriately qualified advisers.</div>`

const base = {
  author: "LÉARGAS Editorial",
  coverImageUrl: "/images/wind.jpg",
  publishedAt: "2026-11-13",
} as const

export const localPosts: Post[] = [
  {
    ...base,
    id: 1,
    slug: "buying-a-wind-project-first-screening",
    category: "Investment insights",
    title: "Buying a wind project: the first questions to ask",
    excerpt:
      "A practical framework for screening a wind energy acquisition before committing to detailed due diligence.",
    readingTimeMinutes: 5,
    content: `
<h2 id="investment-mandate">Start with the investment mandate</h2>
<p>Before reviewing a wind project, define what a successful investment should achieve. A strong resource or an attractive headline valuation does not, by itself, establish a fit with an investor’s objectives.</p>
<p>Clarify the target geography, development stage, equity commitment, ownership share, return objectives and investment horizon. These criteria make early conversations more productive and help distinguish a promising opportunity from a distraction.</p>
<h2 id="what-is-being-acquired">Establish what is being acquired</h2>
<p>Identify the proposed transaction perimeter: shares in a project company, an interest in a portfolio, or a development platform. Ask who owns the relevant interests, who is authorised to discuss a sale, and which obligations would remain with the buyer.</p>
<ul>
<li>What percentage is available, and what governance rights accompany it?</li>
<li>Which assets, contracts, debt and liabilities sit within the perimeter?</li>
<li>Are there partner consents, lender approvals or other transfer conditions to investigate?</li>
</ul>
<p>Ownership and transfer questions should be reviewed by qualified legal advisers before conclusions are drawn.</p>
<h2 id="stage-and-evidence">Understand the stage and evidence</h2>
<p>A development-stage opportunity should be assessed differently from an operating wind farm. For development assets, focus on the evidence behind site access, planning status, permits, grid arrangements and the route to construction. For operating assets, request historical generation, availability, maintenance and financial records.</p>
<p>Separate confirmed documents from management expectations. A useful screening summary marks each material assumption as verified, pending verification or unavailable.</p>
<h2 id="commercial-fundamentals">Test the commercial fundamentals</h2>
<p>Review the revenue arrangements and the assumptions connecting generation to cash flow. Questions may include the applicable offtake terms, payment history, curtailment, operating costs, financing obligations and remaining asset life.</p>
<p>A valuation should be supported by a financial model and scenarios, rather than a single price-per-megawatt comparison. Downside cases can help identify which assumptions require deeper work.</p>
<h2 id="next-decision">Set a clear next decision</h2>
<p>The outcome of screening is a decision about whether to investigate further. Agree the missing information, the specialist advisers needed, confidentiality arrangements and the next decision milestone before allocating significant resources.</p>
<p>A concise investment screening memo can capture the opportunity, investment fit, unresolved issues and recommended next steps.</p>
${disclaimer}`,
  },
  {
    ...base,
    id: 2,
    coverImageUrl: "/images/coastline.jpg",
    slug: "preparing-a-wind-project-for-sale",
    category: "Sell-side advisory",
    title: "Preparing a wind project for a credible sale process",
    excerpt:
      "How project owners can organise information, define the sale perimeter and prepare for investor engagement.",
    readingTimeMinutes: 5,
    content: `
<h2 id="seller-objectives">Define the seller’s objectives</h2>
<p>A structured sale starts with an explicit objective. Is the owner seeking a complete exit, a partial divestment or a partner to finance the next development phase? These choices affect the investor universe, information requirements and transaction structure.</p>
<p>Align shareholders on the desired outcome, timing, acceptable retained exposure and decision-making authority before approaching investors.</p>
<h2 id="project-story">Organise the project story</h2>
<p>Prepare a consistent account of the project’s location, technology, capacity, stage, ownership and commercial arrangements. Distinguish completed milestones from planned activities and clearly explain the evidence available for each.</p>
<p>The strongest presentation is one that investors can verify. Avoid unsupported claims about approvals, returns or guaranteed completion dates.</p>
<h2 id="data-room">Build an orderly data room</h2>
<p>Collect and index the documents that support investor review. Depending on the project stage, these may include:</p>
<ul>
<li>Corporate structure, shareholding records and shareholder agreements.</li>
<li>Land or site-access documents, planning records and permits.</li>
<li>Grid connection and revenue or offtake arrangements.</li>
<li>Resource assessments, technical reports and key construction or service contracts.</li>
<li>Financial statements, financing documents and the project financial model.</li>
</ul>
<p>Use controlled access and a clear document version history. Counsel should help determine what can be shared, when and with whom.</p>
<h2 id="difficult-questions">Prepare for difficult questions</h2>
<p>Investors will seek to understand unresolved matters as well as strengths. Identify missing documentation, contractual constraints, technical issues and disagreements between the financial model and historical performance.</p>
<p>Where possible, develop an action plan and assign responsibility for each issue. Transparent, consistent responses can reduce avoidable disruption during diligence.</p>
<h2 id="engagement">Manage engagement with discipline</h2>
<p>A non-confidential teaser can introduce an opportunity without exposing sensitive project details. Further information should be shared through an agreed process with suitable confidentiality protections.</p>
<p>Maintain an investor log, a central questions-and-answers register and consistent milestones. Compare offers on structure, conditions and execution requirements as well as headline price.</p>
${disclaimer}`,
  },
  {
    ...base,
    id: 3,
    coverImageUrl: "/images/foggy-offshore.jpg",
    slug: "wind-ma-due-diligence-workstreams",
    category: "Transaction essentials",
    title: "Wind M&A due diligence: connecting the workstreams",
    excerpt:
      "Why technical, commercial, financial and legal reviews need to inform one coherent investment decision.",
    readingTimeMinutes: 4,
    content: `
<h2 id="several-perspectives">One investment, several perspectives</h2>
<p>A wind project acquisition brings together questions that require different disciplines. Technical condition, contractual rights, projected cash flows and legal transferability should inform the same investment decision.</p>
<p>The purpose of due diligence is to test assumptions and identify matters requiring action. A report does not eliminate risk or guarantee an investment outcome.</p>
<h2 id="technical-commercial">Technical and commercial review</h2>
<p>Technical review may examine the wind resource, energy yield, turbine condition, availability, maintenance strategy and remaining useful life. The scope should reflect whether the project is in development, construction or operation.</p>
<p>Commercial review connects those findings to revenue arrangements, operating costs, counterparties and contractual allocation of risk. For example, a maintenance assumption can affect both future expenditure and expected generation.</p>
<h2 id="financial-tax-legal">Financial, tax and legal review</h2>
<p>Financial advisers examine the quality of historical information and the assumptions in the investment model. Tax specialists assess the structure and applicable tax exposures. Legal advisers review ownership, contracts, approvals, disputes and the conditions relevant to a transfer.</p>
<p>Local rules and project-specific facts matter. A general checklist cannot establish whether a particular Vietnamese or Southeast Asian transaction is permissible or ready to close.</p>
<h2 id="findings-to-decisions">Translate findings into decisions</h2>
<p>Consolidate material findings into a shared issues register. Each issue should state the evidence, potential impact, responsible adviser and proposed response.</p>
<ul>
<li>Does the finding require a valuation or financial model adjustment?</li>
<li>Can it be resolved before signing or completion?</li>
<li>Does it require an approval, contractual protection or further investigation?</li>
<li>Does it change the investor’s willingness to proceed?</li>
</ul>
<h2 id="coordination">Keep the transaction coordinated</h2>
<p>Agree the review scope early and make dependencies visible. A technical finding should reach the financial modelling team, while a contractual restriction should reach the team negotiating transaction terms.</p>
<p>The final investment view should bring the workstreams together, making clear what is known, what remains uncertain and what conditions underpin the decision.</p>
${disclaimer}`,
  },
]
