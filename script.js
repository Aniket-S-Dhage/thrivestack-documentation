document.addEventListener('DOMContentLoaded', () => {
    mountDocsProductSwitcher();

    // Code tab switching (.tab-btn / .tab-pane pattern used in API reference pages)
    document.querySelectorAll('.code-tabs').forEach(function(tabGroup) {
        tabGroup.querySelectorAll('.tab-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var tab = btn.getAttribute('data-tab');
                tabGroup.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
                tabGroup.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
                btn.classList.add('active');
                tabGroup.querySelector('.tab-pane[data-tab="' + tab + '"]').classList.add('active');
            });
        });
    });

    // Ensure scroll to top on page load unless navigating to a specific hash
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (!window.location.hash) {
        window.scrollTo(0, 0);
    }

    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const htmlEl = document.documentElement;

    // Check for saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    // Search with live suggestions: scroll to a matching heading
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        // container for suggestions
        const suggestions = document.createElement('div');
        suggestions.className = 'search-suggestions';
        searchInput.parentElement.appendChild(suggestions);

        const getHeadings = () => {
            const nodes = [];
            document.querySelectorAll('.content-section h2, .content-section h3, .doc-page-body h1, .doc-page-body h2')
                .forEach(h => {
                    const text = h.textContent.trim();
                    if (!text) return;
                    nodes.push({
                        text,
                        element: h
                    });
                });
            return nodes;
        };

        const headings = getHeadings();

        // Lightweight cross-page index
        const docsIndex = [
            {
                title: 'Getting Started with ThriveStack',
                url: 'index.html#growth-intelligence',
                terms: 'getting started growth intelligence overview unified dashboard signal correlation ai-powered insights'
            },
            {
                title: 'Analyze Signals',
                url: 'analyze-signals.html#identify-high-intent-signals',
                terms: 'analyze signals identify high-intent signals account intelligence bow-tie revenue model analyze revenue & churn churn prediction revenue analytics nrr waterfall cac payback ltv/cac expansion'
            },
            {
                title: 'Take Action',
                url: 'take-action.html#automate-workflow-responses',
                terms: 'take action automate workflow responses act on signals automated workflow engine signal detected action triggered slack alert account owner'
            },
            {
                title: 'Account Intelligence',
                url: 'account-intelligence.html#account-intelligence',
                terms: 'account intelligence take action playbooks signed up not activated activation struggling stalled journey activated not converted pql product qualified leads converted disengaging churn risk save play getaccounts getsegments brevo n8n openclaw automation drive action which accounts'
            },
            {
                title: 'Connect Your Stack',
                url: 'connect-your-stack.html#connect-your-stack',
                terms: 'connect your stack integrations unify data plug and play low code'
            },
            {
                title: 'Analyze Correlated Signals',
                url: 'analyze-correlated-signals.html#analyze-correlated-signals',
                terms: 'analyze correlated signals ai comparison funnel leaks bottlenecks'
            },
            {
                title: 'Drive Revenue Playbooks',
                url: 'drive-revenue-playbooks.html#drive-revenue-playbooks',
                terms: 'drive revenue playbooks alerts slack crm actions'
            },
            {
                title: 'Accelerate Free-to-Paid',
                url: 'accelerate-free-to-paid.html#accelerate-free-to-paid',
                terms: 'accelerate free to paid onboarding funnel conversion'
            },
            {
                title: 'Spot Expansion Signals',
                url: 'spot-expansion-signals.html#spot-expansion-signals',
                terms: 'spot expansion signals nrr upsell cross sell'
            },
            {
                title: 'Stop Churn Early',
                url: 'stop-churn-early.html#stop-churn-early',
                terms: 'stop churn early contraction risk health widget'
            },
            {
                title: 'Events Telemetry',
                url: 'public/product/setup/saas-growth-events.html#saas-growth-events',
                terms: 'journey to event bow tie phases telemetry mapping'
            },
            {
                title: 'Vibe Analytics (AI)',
                url: 'public/product/setup/vibe-analytics.html#vibe-analytics',
                terms: 'vibe analytics ai telemetry spec identify group track checklist'
            },
            {
                title: 'MCP Introduction',
                url: 'public/mcp/introduction.html#overview',
                terms: 'thrivestack mcp model context protocol introduction what is mcp remote server'
            },
            {
                title: 'MCP Setup',
                url: 'public/mcp/setup.html#server-url',
                terms: 'thrivestack mcp setup remote server implementation claude desktop claude code cursor windsurf gemini cli lovable troubleshooting technical specifications x-api-key oauth'
            },
            {
                title: 'MCP Use Cases',
                url: 'public/mcp/use-cases.html#getting-started',
                terms: 'thrivestack mcp use cases correlated journeys marketing product revenue drill down'
            },
            {
                title: 'MCP Prompts',
                url: 'public/mcp/prompts.html#prompts-intro',
                terms: 'thrivestack mcp example prompts tool oriented reference get_mau_mtu_count get_event_count list_accounts get_plg_leads get_setup_status getVisitor getPageViews getSignup acquisition conversion mrr stickiness dau wau mau activation churn expansion'
            },
            {
                title: 'MCP Tools',
                url: 'public/mcp/tools.html#overview',
                terms: 'thrivestack mcp tools catalog reference core analytics accounts gtm setup traffic acquisition activation revenue monetization usage engagement'
            },
            {
                title: 'MCP Changelog',
                url: 'public/mcp/changelog.html#overview',
                terms: 'thrivestack mcp changelog release notes what is new added changed new tools v1 get_page_traffic get_search_performance get_attribution_health list_urls'
            },
            {
                title: 'Revenue Intelligence MCP Introduction',
                url: 'public/revenue/mcp/introduction.html#overview',
                terms: 'revenue intelligence thrivestack mcp server connect claude cursor revenue marketing product analytics accounts mrr arr read-only oauth personal access token'
            },
            {
                title: 'Revenue Intelligence MCP Setup',
                url: 'public/revenue/mcp/setup.html#server-url',
                terms: 'revenue intelligence mcp setup connect claude desktop claude code cursor vs code windsurf gemini cli oauth personal access token verify connection troubleshooting'
            },
            {
                title: 'Revenue Intelligence MCP Use Cases',
                url: 'public/revenue/mcp/use-cases.html#example-workflows',
                terms: 'revenue intelligence thrivestack mcp use cases mrr movement churn revenue leakage missed payments acv channels campaigns ads leads activation retention at-risk accounts'
            },
            {
                title: 'Revenue Intelligence MCP Prompts',
                url: 'public/revenue/mcp/prompts.html#prompt-library',
                terms: 'revenue intelligence thrivestack mcp prompts monthly revenue review mrr movement leakage plan mix goal pacing channel review lead quality activation retention at-risk accounts account brief data health copy prompt'
            },
            {
                title: 'Revenue Intelligence MCP Tools',
                url: 'public/revenue/mcp/tools.html#tool-catalog',
                terms: 'revenue intelligence thrivestack mcp tools reference get_revenue_kpis get_mrr_movements get_channel_performance get_website_traffic get_ads_performance get_lead_quality get_mau_mtu_count get_activation_summary get_retention_data list_at_risk_accounts get_account_overview create_account_segment start_thrivestack_setup'
            },
            {
                title: 'Cited By Introduction',
                url: 'public/cited-by/introduction.html#overview',
                terms: 'cited by ai visibility aeo geo brand mentions prompts citations competitors introduction bulk import mcp'
            },
            {
                title: 'Cited By — What you can do',
                url: 'public/cited-by/introduction.html#what-you-can-do',
                terms: 'cited by track prompts citations competitors bulk import mcp agents'
            },
            {
                title: 'Cited By — Get started',
                url: 'public/cited-by/introduction.html#get-started',
                terms: 'cited by get started ai visibility prompts bulk upload mcp personal access token'
            },
            {
                title: 'Cited By MCP',
                url: 'public/cited-by/mcp.html',
                terms: 'cited by mcp agents claude cursor connect ai visibility'
            },
            {
                title: 'Connect Vercel (AI Crawl Attribution)',
                url: 'public/cited-by/ai-crawl-attribution-vercel.html#overview',
                terms: 'cited by ai crawl attribution connect vercel log drain integration marketplace ai crawlers gptbot claudebot perplexitybot bot traffic one click'
            },
            {
                title: 'Connect Vercel — Steps',
                url: 'public/cited-by/ai-crawl-attribution-vercel.html#connect',
                terms: 'connect vercel steps approve projects verify send test bot traffic activate ai crawl logs add-on'
            },
            {
                title: 'Connect Vercel — What ThriveStack collects',
                url: 'public/cited-by/ai-crawl-attribution-vercel.html#data',
                terms: 'vercel log drain data collected privacy permissions scopes ai crawler requests token'
            },
            {
                title: 'Connect Vercel — Troubleshooting',
                url: 'public/cited-by/ai-crawl-attribution-vercel.html#troubleshooting',
                terms: 'vercel troubleshooting hobby plan pro enterprise no data waiting for ai bot visit domain mismatch disconnect'
            },
            {
                title: 'Connect WordPress (AI Crawl Attribution)',
                url: 'public/cited-by/ai-crawl-attribution-wordpress.html#overview',
                terms: 'cited by ai crawl attribution connect wordpress plugin thrivestack ai crawler tracker server logs access log cache ai crawlers gptbot claudebot perplexitybot bot traffic'
            },
            {
                title: 'Connect WordPress — Steps',
                url: 'public/cited-by/ai-crawl-attribution-wordpress.html#connect',
                terms: 'connect wordpress steps download plugin upload install connection code test connection send now verify activate ai crawl logs add-on connect automatically application password one click'
            },
            {
                title: 'Connect WordPress — What ThriveStack collects',
                url: 'public/cited-by/ai-crawl-attribution-wordpress.html#data',
                terms: 'wordpress plugin data collected privacy access log ai crawler requests application password not stored fallback mode'
            },
            {
                title: 'Connect WordPress — Troubleshooting',
                url: 'public/cited-by/ai-crawl-attribution-wordpress.html#troubleshooting',
                terms: 'wordpress troubleshooting plugin fallback no readable access log connection code get a new code waiting for your plugin to connect listening first ai crawler visit send a test visit wp-cron send now disconnect application password'
            },
            {
                title: 'Cited By Prompts Bulk Import',
                url: 'public/cited-by/prompts-bulk-import.html#overview',
                terms: 'cited by prompts bulk import csv upload template column mapping entitlement'
            },
            {
                title: 'Bulk Import — Match Columns',
                url: 'public/cited-by/prompts-bulk-import.html#match-columns',
                terms: 'bulk import match columns mapper prompt topic dont import aliases query'
            },
            {
                title: 'Bulk Import — Plan Limits',
                url: 'public/cited-by/prompts-bulk-import.html#plan-limits',
                terms: 'bulk import plan limit entitlement upgrade add-on remaining slots'
            },
            {
                title: 'Bulk Import — Troubleshooting',
                url: 'public/cited-by/prompts-bulk-import.html#troubleshooting',
                terms: 'bulk import troubleshooting empty duplicate headers csv'
            },
            {
                title: 'API Reference',
                url: 'api-reference.html#overview',
                terms: 'api reference public endpoints rest http authentication bearer key'
            },
            {
                title: 'Identify Endpoint',
                url: 'public/api/identify.html#identify',
                terms: 'identify user traits email name user_id context group_id device_id session_id'
            },
            {
                title: 'Group Endpoint',
                url: 'public/api/group.html#group',
                terms: 'group account traits group_id user_id account_name account_domain group_type'
            },
            {
                title: 'Track Endpoint',
                url: 'public/api/track.html#track',
                terms: 'track event signed_up account_created feature_used invite_sent page_visit onboarding event_name properties'
            },
            {
                title: 'GetAccounts',
                url: 'public/api/get-accounts.html#get-accounts',
                terms: 'get accounts list graphql growth intelligence filters sort pagination segmentation acquisition activation monetization engagement expansion firmographics mrr arr dau mau churn healthy at risk account fields accountFieldByGraphQLKey public-api-events abuseRuleResult registry filterable sortable'
            },
            {
                title: 'GetAccountById',
                url: 'public/api/get-account-by-id.html#get-account-by-id',
                terms: 'get account by id graphql growth intelligence acquisition activation monetization engagement firmographics mrr arr dau mau single account profile'
            },
            {
                title: 'GetUsers',
                url: 'public/api/get-users.html#get-users',
                terms: 'get users list graphql growth intelligence filters sort pagination user segment cohort acquisition engagement demographics sign ins abuse status utm'
            },
            {
                title: 'GetUserById',
                url: 'public/api/get-user-by-id.html#get-user-by-id',
                terms: 'get user by id graphql growth intelligence acquisition engagement demographics employment title role signin'
            },
            {
                title: 'GetAccountEnrichment',
                url: 'public/api/get-account-enrichment.html#get-account-enrichment',
                terms: 'get account enrichment graphql domain firmographic industry employees revenue technology stack social linkedin twitter'
            },
            {
                title: 'GetUserEnrichment',
                url: 'public/api/get-user-enrichment.html#get-user-enrichment',
                terms: 'get user enrichment graphql email job title role seniority company linkedin social profiles location personalize onboarding'
            },
            {
                title: 'Transactions API',
                url: 'public/api/transactions.html#transactions',
                terms: 'transactions revenue billing crud create list get update delete payment amount currency status charge refund credit'
            },
            {
                title: 'Invoices API',
                url: 'public/api/invoices.html#invoices',
                terms: 'invoices billing revenue crud create list get update void due_date line_items total draft open paid'
            },
            {
                title: 'Subscriptions API',
                url: 'public/api/subscriptions.html#subscriptions',
                terms: 'subscriptions billing recurring revenue crud create list get update cancel plan interval status trial active past_due'
            },
            {
                title: 'Exceptional Use Cases',
                url: 'public/revenue/setup/exceptional-use-cases.html#exceptional-use-cases',
                terms: 'exceptional use cases chargebee stripe payment gateway marketplace platform fee revenue billing connect transactions api'
            },
            {
                title: 'Goal Conversion',
                url: 'public/marketing/setup/goal-conversion.html#create-goal',
                terms: 'goal conversion create goal event tracking pin dashboard goal completions unique visitors repeat visitors target date event filter ts-demo-booked verification pinned goals unified dashboard conversion rate signup demo request page visits'
            }
        ];

        const clearSuggestions = () => {
            suggestions.innerHTML = '';
            suggestions.style.display = 'none';
        };

        const scrollToElement = (el) => {
            const rect = el.getBoundingClientRect();
            const offsetTop = rect.top + window.scrollY - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        };

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                clearSuggestions();
                return;
            }

            const localMatches = headings
                .filter(h => h.text.toLowerCase().includes(query))
                .map(h => ({
                    label: h.text,
                    type: 'section',
                    onSelect: () => scrollToElement(h.element)
                }));

            const path = window.location.pathname.split('/').pop() || 'index.html';

            const globalMatches = docsIndex
                .filter(d =>
                    (d.title.toLowerCase().includes(query) ||
                     d.terms.toLowerCase().includes(query))
                )
                .filter(d => !path.endsWith(d.url.split('#')[0])) // avoid duplicate current page entry
                .map(d => ({
                    label: d.title,
                    type: 'page',
                    onSelect: () => {
                        clearSuggestions();
                        window.location.href = d.url;
                    }
                }));

            const allMatches = [...localMatches, ...globalMatches].slice(0, 7);

            if (!allMatches.length) {
                clearSuggestions();
                return;
            }

            suggestions.innerHTML = '';
            allMatches.forEach(match => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'search-suggestion-item';
                item.textContent = match.label;
                if (match.type === 'page') {
                    item.dataset.type = 'page';
                }
                item.addEventListener('click', match.onSelect);
                suggestions.appendChild(item);
            });
            suggestions.style.display = 'block';
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                clearSuggestions();
                searchInput.blur();
                return;
            }
            if (e.key === 'Enter') {
                const first = suggestions.querySelector('.search-suggestion-item');
                if (first) {
                    first.click();
                    e.preventDefault();
                }
            }
        });

        document.addEventListener('click', (e) => {
            if (!suggestions.contains(e.target) && e.target !== searchInput) {
                clearSuggestions();
            }
        });
    }

    // ScrollSpy for "On this page": follow whatever element each link points to (a section or a
    // heading inside one), so the highlight moves even when many headings share one section.
    const tocItems = Array.from(document.querySelectorAll('.toc-link')).map(link => {
        let id = (link.getAttribute('href') || '').slice(1);
        try { id = decodeURIComponent(id); } catch (e) { /* keep the raw id */ }
        return { link, el: id ? document.getElementById(id) : null };
    }).filter(item => item.el);

    if (tocItems.length) {
        const TOC_OFFSET = 120; // a heading counts as current once it passes this far below the top
        let tocActive = null;
        let tocTicking = false;

        const updateToc = () => {
            tocTicking = false;
            const tops = tocItems.map(item => item.el.getBoundingClientRect().top);
            let current = 0;
            for (let i = 0; i < tocItems.length; i++) {
                if (tops[i] <= TOC_OFFSET && (tops[current] > TOC_OFFSET || tops[i] >= tops[current])) current = i;
            }
            // Short last sections never reach the offset: at the very bottom, the last visible one wins.
            const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
            if (atBottom) {
                for (let i = tocItems.length - 1; i >= 0; i--) {
                    if (tops[i] < window.innerHeight) { current = i; break; }
                }
            }
            const next = tocItems[current].link;
            if (next === tocActive) return;
            tocActive = next;
            tocItems.forEach(item => item.link.classList.toggle('active', item.link === next));

            // Long lists scroll inside the sidebar; keep the current link in view there.
            const box = next.closest('.sticky-top');
            if (box && box.scrollHeight > box.clientHeight) {
                const linkRect = next.getBoundingClientRect();
                const boxRect = box.getBoundingClientRect();
                if (linkRect.top < boxRect.top || linkRect.bottom > boxRect.bottom) {
                    box.scrollTop += (linkRect.top - boxRect.top) - box.clientHeight / 2;
                }
            }
        };
        // A short timer rather than requestAnimationFrame: frames pause in background tabs.
        const requestToc = () => {
            if (!tocTicking) { tocTicking = true; window.setTimeout(updateToc, 40); }
        };
        window.addEventListener('scroll', requestToc, { passive: true });
        window.addEventListener('resize', requestToc);
        window.addEventListener('load', requestToc);
        updateToc();
    }

    // Smooth scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // "Was this page helpful?" feedback (no storage)
    document.querySelectorAll('.content-footer').forEach(footer => {
        const textEl = footer.querySelector('p');
        const buttons = footer.querySelectorAll('.btn-icon');
        if (!textEl || buttons.length < 2) return;

        const [yesBtn, noBtn] = buttons;

        const handleClick = (helpful) => {
            textEl.textContent = helpful
                ? 'Thanks for your feedback!'
                : 'Thanks for your feedback — we’ll use this to improve.';

            [yesBtn, noBtn].forEach(btn => {
                btn.disabled = true;
                btn.classList.add('feedback-submitted');
            });
        };

        yesBtn.addEventListener('click', () => handleClick(true));
        noBtn.addEventListener('click', () => handleClick(false));
    });

    // Sidebar Resizer logic
    const sidebar = document.getElementById('sidebar');
    const resizer = document.getElementById('sidebar-resizer');
    
    // Desktop Sidebar Toggle
    const desktopSidebarToggle = document.getElementById('desktop-sidebar-toggle');
    if (desktopSidebarToggle && sidebar) {
        desktopSidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            if (resizer) {
                resizer.classList.toggle('collapsed');
            }
        });
    }

    if (sidebar && resizer) {
        let isResizing = false;

        resizer.addEventListener('mousedown', (e) => {
            isResizing = true;
            document.body.style.cursor = 'col-resize';
            resizer.classList.add('dragging');
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const containerOffsetLeft = sidebar.parentElement.getBoundingClientRect().left;
            let newWidth = e.clientX - containerOffsetLeft;
            
            if (newWidth < 200) newWidth = 200;
            if (newWidth > 600) newWidth = 600;
            
            sidebar.style.width = newWidth + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                resizer.classList.remove('dragging');
            }
        });
    }
});

class ReadyToScalePromo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="toc-promo glass-panel">
                <div class="promo-icon"><i class="fa-solid fa-rocket gradient-text"></i></div>
                <h5>Ready to scale?</h5>
                <p>Book a demo with our growth team today.</p>
                <a href="https://cal.com/thrivestack/strategy?duration=45&overlayCalendar=true" class="btn-secondary btn-sm thrivestack-event:ts-demo-booked" target="_blank" rel="noopener noreferrer">Get Started</a>
            </div>
        `;
    }
}
customElements.define('ready-to-scale-promo', ReadyToScalePromo);

class SetupSidebar extends HTMLElement {
    connectedCallback() {
        const prefix = this.getAttribute('base-path') || '';
        this.innerHTML = `
            <div class="sidebar-section">
                <h3>Overview</h3>
                <ul>
                    <li><a href="${prefix}setup-overview.html" class="nav-item"><span>Setup (Unify) Overview</span></a></li>
                    <li><a href="${prefix}data-collection.html" class="nav-item"><span>Data Collection</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Marketing Intelligence</h3>
                <ul>
                    <li><a href="${prefix}public/marketing/setup/setup-with-ai.html" class="nav-item"><span>Setup with AI (LLM)</span><span class="time-badge">2 mins</span></a></li>
                    <li><a href="#" class="nav-item"><span>Setup Manually</span><span class="time-badge">10 mins</span></a></li>
                    <li><a href="${prefix}public/marketing/setup/implement-with-prompt-marketing.html" class="nav-item"><span>Implement with Prompt</span></a></li>
                    <li><a href="${prefix}public/marketing/setup/goal-conversion.html" class="nav-item"><span>Goal Conversion</span></a></li>
                    <li><a href="${prefix}public/marketing/setup/google-ads.html" class="nav-item"><span>Google Ads</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Product Intelligence</h3>
                <ul>
                    <li><a href="${prefix}public/product/setup/introduction.html" class="nav-item"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/product/setup/setup-with-ai.html" class="nav-item"><span>Setup with AI</span><span class="time-badge">2 mins</span></a></li>
                    <li><a href="${prefix}public/product/setup/multi-repo-setup.html" class="nav-item"><span>Multi-Repo &amp; Split Flows</span></a></li>
                    <li><a href="${prefix}public/product/setup/setup-manually.html" class="nav-item"><span>Setup Manually</span><span class="time-badge">~1hr</span></a></li>
                    <li><a href="${prefix}public/product/setup/saas-growth-events.html" class="nav-item"><span>Understand Events Telemetry</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/why-correlation.html" class="nav-item"><span>Why Correlation Matters</span></a></li>
                    <li><a href="${prefix}public/product/setup/environment-correlation.html" class="nav-item"><span>Environments and API Keys</span></a></li>
                    <li><a href="${prefix}public/product/setup/advanced-ai-instrumentation.html" class="nav-item"><span>Advanced AI Instrumentation</span><span class="time-badge" style="background:rgba(99,102,241,0.15);color:#818cf8;">Beta</span></a></li>
                    <li><a href="${prefix}public/product/setup/api-cli-instrumentation.html" class="nav-item"><span>Track API, CLI &amp; Agent Usage</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Revenue Intelligence</h3>
                <ul>
                    <li><a href="${prefix}public/revenue/setup/introduction.html" class="nav-item"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/setup-with-ai.html" class="nav-item"><span>Setup with AI (LLM)</span><span class="time-badge">2 mins</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/setup-manually.html" class="nav-item"><span>Setup Manually</span><span class="time-badge">~1hr</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/chargebee-integration.html" class="nav-item"><span>Chargebee Integration</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/stripe-integration.html" class="nav-item"><span>Stripe Integration</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/why-correlation.html" class="nav-item"><span>Why Correlation Matters</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/exceptional-use-cases.html" class="nav-item"><span>Exceptional Use Cases</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>CRM Sync</h3>
                <ul>
                    <li><a href="${prefix}public/crm-sync/introduction.html" class="nav-item"><span>HubSpot Overview</span></a></li>
                    <li><a href="${prefix}public/crm-sync/hubspot-inbound.html" class="nav-item"><span>HubSpot → ThriveStack</span></a></li>
                    <li><a href="${prefix}public/crm-sync/hubspot-outbound.html" class="nav-item"><span>ThriveStack → HubSpot</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Customer Success</h3>
                <ul>
                    <li><a href="${prefix}public/customer-success/introduction.html" class="nav-item"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/customer-success/setup-health-scores.html" class="nav-item"><span>Setup Health Scores</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Billing</h3>
                <ul>
                    <li><a href="${prefix}startup-cohort-discount.html" class="nav-item"><span>Startup Cohort Discount</span></a></li>
                </ul>
            </div>
        `;
        
        // Handle Active State
        let currentPath = window.location.pathname;
        if (currentPath.endsWith('/')) {
            currentPath += 'index.html';
        }
        
        const links = this.querySelectorAll('a.nav-item');
        const currentFile = currentPath.split('/').pop();
        const isMarketing = currentPath.includes('marketing');
        const isProduct = currentPath.includes('product');
        const isRevenue = currentPath.includes('revenue');
        const isCRM = currentPath.includes('crm-sync');
        const isCS = currentPath.includes('customer-success');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                const hrefPath = href.split('/').pop();
                
                if (hrefPath === currentFile) {
                    if (hrefPath === 'setup-with-ai.html' || hrefPath === 'setup-manually.html') {
                        if (isMarketing && href.includes('marketing')) link.classList.add('active');
                        else if (isProduct && href.includes('product')) link.classList.add('active');
                        else if (isRevenue && href.includes('revenue')) link.classList.add('active');
                    } else if (hrefPath === 'introduction.html') {
                        if (isProduct && href.includes('product')) link.classList.add('active');
                        else if (isRevenue && href.includes('revenue')) link.classList.add('active');
                        else if (isCRM && href.includes('crm-sync')) link.classList.add('active');
                        else if (isCS && href.includes('customer-success')) link.classList.add('active');
                    } else {
                        link.classList.add('active');
                    }
                }
            }
        });
    }
}
customElements.define('setup-sidebar', SetupSidebar);

/** Unified Cited By left nav (includes MCP docs under the Cited By product). */
class CitedBySidebar extends HTMLElement {
    connectedCallback() {
        const prefix = this.getAttribute('base-path') || '';
        this.innerHTML = `
            <div class="sidebar-section">
                <h3>Cited By</h3>
                <ul>
                    <li><a href="${prefix}public/cited-by/introduction.html" class="nav-item" data-nav="cited-intro"><span>Introduction</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>AI Crawl Attribution</h3>
                <ul>
                    <li><a href="${prefix}public/cited-by/ai-crawl-attribution-vercel.html" class="nav-item" data-nav="crawl-vercel"><span>Connect Vercel</span></a></li>
                    <li><a href="${prefix}public/cited-by/ai-crawl-attribution-wordpress.html" class="nav-item" data-nav="crawl-wordpress"><span>Connect WordPress</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>MCP</h3>
                <ul>
                    <li><a href="${prefix}public/mcp/introduction.html" class="nav-item" data-nav="mcp-intro"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/mcp/setup.html" class="nav-item" data-nav="mcp-setup"><span>Setup</span></a></li>
                    <li><a href="${prefix}public/mcp/use-cases.html" class="nav-item" data-nav="mcp-use-cases"><span>Use Cases</span></a></li>
                    <li><a href="${prefix}public/mcp/prompts.html" class="nav-item" data-nav="mcp-prompts"><span>Prompts</span></a></li>
                    <li><a href="${prefix}public/mcp/tools.html" class="nav-item" data-nav="mcp-tools"><span>Tools</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>Prompts</h3>
                <ul>
                    <li><a href="${prefix}public/cited-by/prompts-bulk-import.html" class="nav-item" data-nav="prompts-bulk"><span>Bulk import</span></a></li>
                </ul>
            </div>
        `;

        let currentPath = window.location.pathname || '';
        if (currentPath.endsWith('/')) currentPath += 'index.html';
        const file = currentPath.split('/').pop() || '';
        const inCitedBy = currentPath.includes('/cited-by/');
        const inMcp = currentPath.includes('/mcp/');

        let active = '';
        if (inCitedBy && file === 'introduction.html') active = 'cited-intro';
        else if (inCitedBy && file === 'prompts-bulk-import.html') active = 'prompts-bulk';
        else if (inCitedBy && file === 'ai-crawl-attribution-vercel.html') active = 'crawl-vercel';
        else if (inCitedBy && file === 'ai-crawl-attribution-wordpress.html') active = 'crawl-wordpress';
        else if (inCitedBy && file === 'mcp.html') active = 'mcp-intro';
        else if (inMcp && file === 'introduction.html') active = 'mcp-intro';
        else if (inMcp && file === 'setup.html') active = 'mcp-setup';
        else if (inMcp && file === 'use-cases.html') active = 'mcp-use-cases';
        else if (inMcp && file === 'prompts.html') active = 'mcp-prompts';
        else if (inMcp && file === 'tools.html') active = 'mcp-tools';

        if (active) {
            const link = this.querySelector(`[data-nav="${active}"]`);
            if (link) link.classList.add('active');
        }
    }
}
customElements.define('cited-by-sidebar', CitedBySidebar);

/** Which product's docs a path belongs to. The Revenue Intelligence MCP docs live in public/revenue/mcp/. */
function docsProductFromPath(path) {
    const inRevenueMcp = path.includes('/revenue/mcp/');
    return (path.includes('/cited-by/') || (path.includes('/mcp/') && !inRevenueMcp)) ? 'citedby' : 'thrivestack';
}

/** The MCP changelog covers the whole server, so it belongs to neither product. */
function docsIsSharedMcpPage(path) {
    return path.endsWith('/mcp/changelog.html');
}

/** The product to show for a path; the shared changelog follows the product the reader came from. */
function docsCurrentProduct(path) {
    if (docsIsSharedMcpPage(path)) {
        try {
            return sessionStorage.getItem('docs_product_ctx') === 'thrivestack' ? 'thrivestack' : 'citedby';
        } catch (_) {
            return 'citedby';
        }
    }
    return docsProductFromPath(path);
}

/** ThriveStack (Revenue Intelligence) left nav for its MCP docs, mirroring the Cited By one above. */
class ThriveStackMcpSidebar extends HTMLElement {
    connectedCallback() {
        const prefix = this.getAttribute('base-path') || '';
        this.innerHTML = `
            <div class="sidebar-section">
                <h3>Revenue Intelligence</h3>
                <ul>
                    <li><a href="${prefix}public/revenue/setup/introduction.html" class="nav-item"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/stripe-integration.html" class="nav-item"><span>Stripe Integration</span></a></li>
                    <li><a href="${prefix}public/revenue/setup/chargebee-integration.html" class="nav-item"><span>Chargebee Integration</span></a></li>
                </ul>
            </div>

            <div class="sidebar-section">
                <h3>MCP</h3>
                <ul>
                    <li><a href="${prefix}public/revenue/mcp/introduction.html" class="nav-item" data-nav="introduction.html"><span>Introduction</span></a></li>
                    <li><a href="${prefix}public/revenue/mcp/setup.html" class="nav-item" data-nav="setup.html"><span>Setup</span></a></li>
                    <li><a href="${prefix}public/revenue/mcp/use-cases.html" class="nav-item" data-nav="use-cases.html"><span>Use Cases</span></a></li>
                    <li><a href="${prefix}public/revenue/mcp/prompts.html" class="nav-item" data-nav="prompts.html"><span>Prompts</span></a></li>
                    <li><a href="${prefix}public/revenue/mcp/tools.html" class="nav-item" data-nav="tools.html"><span>Tools</span></a></li>
                </ul>
            </div>
        `;

        const file = (window.location.pathname || '').split('/').pop() || '';
        const link = this.querySelector(`[data-nav="${file}"]`);
        if (link) link.classList.add('active');
    }
}
customElements.define('thrivestack-mcp-sidebar', ThriveStackMcpSidebar);

/** Left nav for pages shared by both products: renders the sidebar of the product the reader came from. */
class DocsMcpSidebar extends HTMLElement {
    connectedCallback() {
        const tag = docsCurrentProduct(window.location.pathname || '') === 'thrivestack' ? 'thrivestack-mcp-sidebar' : 'cited-by-sidebar';
        const inner = document.createElement(tag);
        inner.setAttribute('base-path', this.getAttribute('base-path') || '');
        this.appendChild(inner);
    }
}
customElements.define('docs-mcp-sidebar', DocsMcpSidebar);

/**
 * Top-left docs product switcher (ThriveStack ↔ citedby), mirrors the plg-crm-ui account/product box.
 * Replaces `.top-nav a.logo` on every page that loads this script.
 */
function mountDocsProductSwitcher() {
    const logoLink = document.querySelector('.top-nav .nav-left > a.logo');
    if (!logoLink || logoLink.dataset.productSwitcher === '1') return;

    const logoImg = logoLink.querySelector('img');
    const logoSrc = logoImg ? logoImg.getAttribute('src') : 'logo.png';
    const slash = logoSrc.lastIndexOf('/');
    const prefix = slash >= 0 ? logoSrc.slice(0, slash + 1) : '';

    const path = window.location.pathname || '';
    const currentProduct = docsCurrentProduct(path);
    // Remember the product for the shared changelog page, which follows the reader's product.
    if (!docsIsSharedMcpPage(path)) {
        try { sessionStorage.setItem('docs_product_ctx', currentProduct); } catch (_) { /* ignore */ }
    }

    // On an MCP page, switching product lands on the other product's MCP introduction
    // (so the dropdown flips between the two MCP sections); elsewhere it goes to the product home.
    const inMcp = path.includes('/mcp/');
    const homes = {
        thrivestack: inMcp ? `${prefix}public/revenue/mcp/introduction.html` : `${prefix}index.html`,
        citedby: inMcp ? `${prefix}public/mcp/introduction.html` : `${prefix}public/cited-by/introduction.html`,
    };

    // The top-nav "MCP" link points at the Cited By MCP docs on every page; on ThriveStack pages
    // it should open the ThriveStack (Revenue Intelligence) MCP docs instead.
    if (currentProduct === 'thrivestack') {
        document.querySelectorAll('.top-nav .nav-links a[href$="public/mcp/introduction.html"]').forEach((a) => {
            a.setAttribute('href', a.getAttribute('href').replace('public/mcp/introduction.html', 'public/revenue/mcp/introduction.html'));
        });
    }

    // "Changelog" sits right of "MCP" in the header on every page that has an MCP link. It is one
    // shared page for the whole server, so it is added here rather than in each page's markup.
    const mcpNavLink = document.querySelector('.top-nav .nav-links a[href$="mcp/introduction.html"]');
    if (mcpNavLink && !document.querySelector('.top-nav .nav-links a[data-docs-changelog]')) {
        const changelogLink = document.createElement('a');
        changelogLink.textContent = 'Changelog';
        changelogLink.dataset.docsChangelog = '1';
        changelogLink.setAttribute('href', mcpNavLink.getAttribute('href').replace(/public\/(?:revenue\/)?mcp\/introduction\.html$/, 'public/mcp/changelog.html'));
        mcpNavLink.after(changelogLink);
        if (docsIsSharedMcpPage(path)) {
            mcpNavLink.classList.remove('active');
            changelogLink.classList.add('active');
        }
    }

    const root = document.createElement('div');
    root.className = 'docs-product-switcher';
    root.dataset.product = currentProduct;
    root.dataset.productSwitcher = '1';

    // logo.png is the full ThriveStack wordmark — use it as the brand mark (no extra text).
    const thrivestackBrandHtml = `
        <span class="docs-product-switcher__brand docs-product-switcher__brand--ts" aria-label="ThriveStack">
            <img src="${logoSrc}" alt="ThriveStack" class="docs-product-switcher__logo" draggable="false">
        </span>`;

    const citedbyBrandHtml = `
        <span class="docs-product-switcher__brand docs-product-switcher__brand--citedby" aria-label="citedby">
            <span class="docs-product-switcher__citedby">cited<span class="by">by</span></span>
        </span>`;

    const triggerBrand = currentProduct === 'citedby' ? citedbyBrandHtml : thrivestackBrandHtml;
    const triggerAria = currentProduct === 'citedby' ? 'citedby documentation' : 'ThriveStack documentation';

    root.innerHTML = `
        <button type="button" class="docs-product-switcher__trigger" aria-expanded="false" aria-haspopup="listbox" aria-label="Switch documentation product. Current: ${triggerAria}">
            ${triggerBrand}
            <i class="fa-solid fa-chevron-down docs-product-switcher__chevron" aria-hidden="true"></i>
        </button>
        <div class="docs-product-switcher__menu" role="listbox" hidden>
            <button type="button" class="docs-product-switcher__option${currentProduct === 'thrivestack' ? ' is-active' : ''}" role="option" data-product="thrivestack" aria-selected="${currentProduct === 'thrivestack'}">
                ${thrivestackBrandHtml}
                <span class="docs-product-switcher__meta">Growth Intelligence</span>
                <i class="fa-solid fa-check docs-product-switcher__check" aria-hidden="true"></i>
            </button>
            <button type="button" class="docs-product-switcher__option${currentProduct === 'citedby' ? ' is-active' : ''}" role="option" data-product="citedby" aria-selected="${currentProduct === 'citedby'}">
                ${citedbyBrandHtml}
                <span class="docs-product-switcher__meta">AI Visibility</span>
                <i class="fa-solid fa-check docs-product-switcher__check" aria-hidden="true"></i>
            </button>
        </div>
    `;

    logoLink.replaceWith(root);

    const trigger = root.querySelector('.docs-product-switcher__trigger');
    const menu = root.querySelector('.docs-product-switcher__menu');

    const setOpen = (open) => {
        menu.hidden = !open;
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
        root.classList.toggle('is-open', open);
    };

    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen(menu.hidden);
    });

    root.querySelectorAll('.docs-product-switcher__option').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const product = btn.getAttribute('data-product');
            if (!product || product === currentProduct) {
                setOpen(false);
                return;
            }
            try {
                localStorage.setItem('docs_product', product);
            } catch (_) { /* ignore */ }
            window.location.href = homes[product];
        });
    });

    document.addEventListener('mousedown', (e) => {
        if (!root.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setOpen(false);
    });
}
