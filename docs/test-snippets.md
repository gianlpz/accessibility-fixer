# HTML Test Snippets for Accessibility Fixer

Copy and paste any of these into the audit tool. Each one contains intentional WCAG violations.

---

## 1. Missing Image Alt Text (Critical)

```html
<html>
<head><title>Photo Gallery</title></head>
<body>
  <h1>Our Team</h1>
  <img src="ceo.jpg" width="200">
  <img src="cto.jpg" width="200">
  <img src="designer.jpg" width="200">
  <p>Meet the people behind the product.</p>
</body>
</html>
```

**Expected violations:** `image-alt` — all 3 images missing alt attributes.

---

## 2. Empty Buttons & Links (Serious)

```html
<html>
<head><title>Dashboard</title></head>
<body>
  <nav>
    <a href="/home"><img src="logo.png"></a>
    <a href="/settings"></a>
    <button></button>
    <button><i class="icon-search"></i></button>
  </nav>
  <main>
    <h1>Welcome back</h1>
    <p>Your dashboard is ready.</p>
  </main>
</body>
</html>
```

**Expected violations:** `link-name`, `button-name`, `image-alt` — links and buttons with no discernible text.

---

## 3. Low Contrast Text (Serious)

```html
<html>
<head><title>Blog Post</title></head>
<body style="background: #ffffff;">
  <h1 style="color: #cccccc;">Welcome to My Blog</h1>
  <p style="color: #aaaaaa;">This paragraph has very low contrast against the white background.</p>
  <a href="/about" style="color: #bbbbbb;">About me</a>
  <small style="color: #d0d0d0;">Posted on March 13, 2026</small>
</body>
</html>
```

**Expected violations:** `color-contrast` — all text elements fail WCAG AA contrast ratios.

---

## 4. Missing Form Labels (Critical)

```html
<html>
<head><title>Contact Us</title></head>
<body>
  <h1>Contact Form</h1>
  <form action="/submit">
    <input type="text" placeholder="Your name">
    <input type="email" placeholder="Email address">
    <textarea placeholder="Your message"></textarea>
    <select>
      <option value="">Choose a topic</option>
      <option value="support">Support</option>
      <option value="sales">Sales</option>
    </select>
    <button type="submit">Send</button>
  </form>
</body>
</html>
```

**Expected violations:** `label`, `select-name` — form inputs with no associated labels (placeholders don't count).

---

## 5. Bad Document Structure (Moderate)

```html
<html>
<body>
  <div onclick="navigate('/')">Home</div>
  <div onclick="navigate('/about')">About</div>
  <h3>Welcome</h3>
  <h1>Our Services</h1>
  <h5>Web Design</h5>
  <p>We build websites.</p>
  <h2>Contact</h2>
  <div style="color: white; background: white;">Hidden text</div>
</body>
</html>
```

**Expected violations:** `heading-order`, `page-has-heading-one`, `html-has-lang`, `landmark-one-main` — skipped heading levels, no lang attribute, no landmarks, clickable divs instead of buttons.

---

## 6. Kitchen Sink (Multiple Severity Levels)

```html
<html>
<head><title>Shop</title></head>
<body>
  <div id="nav">
    <a href="/"><img src="logo.svg"></a>
    <a href="/cart"></a>
  </div>
  <h3>Featured Products</h3>
  <div>
    <img src="product1.jpg">
    <p style="color: #ccc; background: #fff;">Wireless Headphones - $49.99</p>
    <button onclick="addToCart(1)"></button>
  </div>
  <div>
    <img src="product2.jpg">
    <p style="color: #bbb; background: #fff;">Phone Case - $19.99</p>
    <button><img src="cart-icon.png"></button>
  </div>
  <form>
    <input type="text" placeholder="Search products">
    <input type="email" placeholder="Newsletter signup">
  </form>
  <marquee>Free shipping on orders over $50!</marquee>
</body>
</html>
```

**Expected violations:** `image-alt`, `link-name`, `button-name`, `color-contrast`, `label`, `heading-order`, `html-has-lang`, `landmark-one-main`, `marquee` — a mix of critical, serious, moderate, and minor issues.

---

## 7. SaaS Dashboard with Data Tables & Modals

```html
<html lang="en">
<head><title>Analytics Dashboard</title></head>
<body>
  <header>
    <nav aria-label="Main">
      <a href="/"><img src="logo.svg"></a>
      <ul>
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/settings" aria-current="page">Settings</a></li>
      </ul>
      <button aria-expanded="false" aria-haspopup="true">
        <img src="avatar.png">
      </button>
    </nav>
  </header>
  <main>
    <h1>Monthly Analytics</h1>
    <section>
      <h3>Traffic Overview</h3>
      <table>
        <tr><td>Page</td><td>Views</td><td>Bounce Rate</td><td>Avg. Time</td></tr>
        <tr><td>/home</td><td>12,430</td><td>42%</td><td>2:31</td></tr>
        <tr><td>/pricing</td><td>8,291</td><td>38%</td><td>3:12</td></tr>
        <tr><td>/blog</td><td>6,102</td><td>55%</td><td>1:45</td></tr>
      </table>
    </section>
    <section>
      <h2>Conversion Funnel</h2>
      <div role="img" style="width:100%;height:300px;background:#f0f0f0;"></div>
      <div>
        <a href="#" onclick="exportCSV()">Export</a>
        <a href="#" onclick="shareReport()">Share</a>
      </div>
    </section>
    <div role="dialog" style="display:block;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:24px;border:1px solid #ccc;z-index:1000;">
      <h4>Confirm Export</h4>
      <p>This will download a CSV file with all analytics data for March 2026.</p>
      <div>
        <button onclick="cancel()">Cancel</button>
        <button onclick="confirm()" autofocus>Confirm</button>
      </div>
    </div>
  </main>
  <footer>
    <p>&copy; 2026 Acme Analytics</p>
    <ul>
      <li><a href="/privacy">Privacy</a></li>
      <li><a href="/terms">Terms</a></li>
    </ul>
  </footer>
</body>
</html>
```

**Expected violations:** `image-alt` (avatar), `heading-order` (h1→h3 skip), `aria-dialog-name` (dialog missing label), `role-img-alt` (chart div missing alt), table missing `<thead>`/`<th>` scope.

---

## 8. E-commerce Product Page with Reviews

```html
<html lang="en">
<head><title>Wireless Noise-Cancelling Headphones</title></head>
<body>
  <a href="#main" class="sr-only">Skip to content</a>
  <header>
    <nav>
      <a href="/" aria-label="Home"><img src="logo.png" alt="Store"></a>
      <form role="search">
        <input type="search" placeholder="Search products...">
        <button type="submit"><svg viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg></button>
      </form>
      <a href="/cart" aria-label="Cart (3 items)">
        <svg viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/></svg>
      </a>
    </nav>
  </header>
  <main id="main">
    <div itemscope itemtype="https://schema.org/Product">
      <div>
        <img src="headphones-1.jpg" width="600" height="600">
        <div>
          <img src="headphones-2.jpg" width="100" height="100" onclick="changeImage(1)">
          <img src="headphones-3.jpg" width="100" height="100" onclick="changeImage(2)">
          <img src="headphones-4.jpg" width="100" height="100" onclick="changeImage(3)">
        </div>
      </div>
      <div>
        <h1 itemprop="name">Sony WH-1000XM5</h1>
        <div>
          <span style="color:#f59e0b;">&#9733;&#9733;&#9733;&#9733;&#9734;</span>
          <a href="#reviews">4.2 (1,247 reviews)</a>
        </div>
        <p itemprop="description">Industry-leading noise cancellation with Auto NC Optimizer, crystal-clear hands-free calling, and up to 30 hours of battery life.</p>
        <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
          <span itemprop="price" content="348"><del>$399.99</del> $348.00</span>
          <meta itemprop="priceCurrency" content="USD">
        </div>
        <fieldset>
          <legend>Color</legend>
          <label><input type="radio" name="color" value="black" checked> Black</label>
          <label><input type="radio" name="color" value="silver"> Silver</label>
          <label><input type="radio" name="color" value="blue"> Midnight Blue</label>
        </fieldset>
        <div>
          <label for="qty">Quantity</label>
          <select id="qty"><option>1</option><option>2</option><option>3</option></select>
        </div>
        <button style="background:#f59e0b;color:white;padding:12px 32px;border:none;font-size:16px;">Add to Cart</button>
        <button style="background:none;border:1px solid #ccc;padding:12px 32px;">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>
    </div>
    <section id="reviews">
      <h2>Customer Reviews</h2>
      <div role="list">
        <div role="listitem">
          <div>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
          <h5>Best headphones I've owned</h5>
          <p>By <span>AudioFan92</span> on <time datetime="2026-02-15">Feb 15, 2026</time></p>
          <p>The noise cancellation is incredible. I use these daily on the tube and they completely block out everything.</p>
          <div>
            <button onclick="helpful(1)">Helpful (23)</button>
            <button onclick="report(1)">Report</button>
          </div>
        </div>
        <div role="listitem">
          <div>&#9733;&#9733;&#9733;&#9734;&#9734;</div>
          <h5>Good but pricey</h5>
          <p>By <span>BudgetBuyer</span> on <time datetime="2026-01-28">Jan 28, 2026</time></p>
          <p>Sound quality is excellent but for this price I expected a better carrying case and USB-C cable.</p>
        </div>
      </div>
    </section>
  </main>
  <footer>
    <nav aria-label="Footer">
      <a href="/support">Support</a>
      <a href="/returns">Returns</a>
      <a href="/shipping">Shipping</a>
    </nav>
  </footer>
</body>
</html>
```

**Expected violations:** `image-alt` (product images missing alt), `button-name` (wishlist SVG button), `heading-order` (h2→h5 in reviews), `svg-img-alt` (SVG icons in buttons), `color-contrast` (stars colour on white).

---

## 9. Multi-step Form Wizard with Validation

```html
<html lang="en">
<head><title>Create Account — Step 2 of 4</title></head>
<body>
  <header><nav><a href="/">Acme Platform</a></nav></header>
  <main>
    <h1>Create Your Account</h1>
    <nav aria-label="Progress">
      <ol>
        <li aria-current="false"><a href="/signup/1">Personal Info</a></li>
        <li aria-current="step">Company Details</li>
        <li>Plan Selection</li>
        <li>Payment</li>
      </ol>
    </nav>
    <form novalidate>
      <h2>Company Details</h2>
      <div>
        <input type="text" id="company" required aria-invalid="true" aria-describedby="company-error" value="">
        <div id="company-error" role="alert" style="color:red;font-size:12px;">Company name is required</div>
      </div>
      <div>
        <label for="industry">Industry</label>
        <select id="industry" required>
          <option value="">Select industry...</option>
          <option>Technology</option>
          <option>Healthcare</option>
          <option>Finance</option>
          <option>Education</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label for="size">Company Size</label>
        <div role="radiogroup">
          <label><input type="radio" name="size" value="1-10"> 1-10</label>
          <label><input type="radio" name="size" value="11-50"> 11-50</label>
          <label><input type="radio" name="size" value="51-200"> 51-200</label>
          <label><input type="radio" name="size" value="201+"> 201+</label>
        </div>
      </div>
      <div>
        <label for="website">Company Website</label>
        <input type="url" id="website" placeholder="https://example.com" aria-describedby="website-hint">
        <div id="website-hint" style="color:#999;font-size:12px;">Optional — helps us personalise your experience</div>
      </div>
      <div>
        <label for="logo-upload">Company Logo</label>
        <input type="file" id="logo-upload" accept="image/*">
        <p style="color:#999;font-size:11px;">Max 2MB. PNG, JPG, or SVG.</p>
      </div>
      <div>
        <input type="checkbox" id="terms">
        <label for="terms">I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></label>
      </div>
      <div>
        <button type="button" onclick="goBack()">Back</button>
        <button type="submit">Continue to Step 3</button>
      </div>
    </form>
  </main>
</body>
</html>
```

**Expected violations:** `label` (company input missing label), `radiogroup` missing label/`aria-label`, `color-contrast` (hint text #999 on white), link targets open new windows without warning.

---

## 10. Media-heavy Blog Article

```html
<html lang="en">
<head><title>Building Accessible Web Apps in 2026</title></head>
<body>
  <header>
    <nav aria-label="Main">
      <a href="/"><img src="blog-logo.svg" alt="DevBlog"></a>
      <ul role="menubar">
        <li role="none"><a role="menuitem" href="/articles">Articles</a></li>
        <li role="none"><a role="menuitem" href="/tutorials">Tutorials</a></li>
        <li role="none"><a role="menuitem" href="/podcast">Podcast</a></li>
        <li role="none">
          <button role="menuitem" aria-expanded="false" aria-haspopup="menu">More</button>
          <ul role="menu" hidden>
            <li role="none"><a role="menuitem" href="/about">About</a></li>
            <li role="none"><a role="menuitem" href="/contact">Contact</a></li>
          </ul>
        </li>
      </ul>
    </nav>
  </header>
  <main>
    <article>
      <header>
        <h1>Building Accessible Web Apps in 2026</h1>
        <p>By <a href="/author/sarah">Sarah Chen</a> &middot; <time datetime="2026-03-10">March 10, 2026</time> &middot; 12 min read</p>
      </header>
      <img src="hero-a11y.jpg" width="1200" height="630">
      <p>Accessibility isn't just a compliance checkbox — it's a fundamental aspect of quality software engineering that affects 1 in 5 users worldwide.</p>
      <h2>The State of Web Accessibility</h2>
      <p>According to the WebAIM Million report, 96.3% of home pages had detectable WCAG failures in 2025.</p>
      <figure>
        <img src="chart-failures.png" width="800" height="400">
        <figcaption>Common WCAG failures by category, 2020-2025</figcaption>
      </figure>
      <blockquote cite="https://www.w3.org/WAI/">
        <p>The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.</p>
        <footer>— Tim Berners-Lee</footer>
      </blockquote>
      <h2>Key Techniques for 2026</h2>
      <h4>1. Semantic HTML First</h4>
      <p>Before reaching for ARIA, exhaust native HTML elements. A <code>&lt;button&gt;</code> is always better than a <code>&lt;div role="button"&gt;</code>.</p>
      <pre><code>&lt;!-- Bad --&gt;
&lt;div class="btn" onclick="submit()" tabindex="0" role="button"&gt;Submit&lt;/div&gt;

&lt;!-- Good --&gt;
&lt;button type="submit"&gt;Submit&lt;/button&gt;</code></pre>
      <h4>2. Focus Management in SPAs</h4>
      <p>When navigating between views in a single-page app, move focus to the new content heading.</p>
      <h4>3. Testing with Real Assistive Tech</h4>
      <p>Automated tools catch only 30-40% of accessibility issues. Manual testing with VoiceOver, NVDA, and JAWS is essential.</p>
      <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" allowfullscreen></iframe>
      <h2>Conclusion</h2>
      <p>Accessibility is a journey, not a destination. Start with automated testing, layer in manual testing, and involve disabled users in your process.</p>
      <div>
        <span>Share:</span>
        <a href="https://twitter.com/share"><img src="twitter.svg" width="24"></a>
        <a href="https://linkedin.com/share"><img src="linkedin.svg" width="24"></a>
        <a href="mailto:?subject=Check this out"><img src="email.svg" width="24"></a>
      </div>
    </article>
    <aside>
      <h3>Related Articles</h3>
      <ul>
        <li><a href="/color-contrast-guide">The Complete Guide to Color Contrast</a></li>
        <li><a href="/aria-patterns">ARIA Design Patterns You Should Know</a></li>
        <li><a href="/testing-a11y">How to Test Accessibility Like a Pro</a></li>
      </ul>
    </aside>
  </main>
</body>
</html>
```

**Expected violations:** `image-alt` (hero image, chart, share icons), `heading-order` (h2→h4 skips), `frame-title` (iframe missing title), `link-name` (share links with only images).

---

## 11. Admin Settings Panel with Tabs & Toggles

```html
<html lang="en">
<head><title>Settings — Acme Platform</title></head>
<body>
  <div style="display:flex;min-height:100vh;">
    <aside style="width:240px;background:#1e293b;color:white;padding:16px;">
      <div style="font-weight:bold;font-size:18px;margin-bottom:24px;">Acme</div>
      <nav>
        <a href="/dashboard" style="color:#94a3b8;display:block;padding:8px;text-decoration:none;">Dashboard</a>
        <a href="/users" style="color:#94a3b8;display:block;padding:8px;text-decoration:none;">Users</a>
        <a href="/settings" style="color:white;display:block;padding:8px;text-decoration:none;background:#334155;border-radius:6px;" aria-current="page">Settings</a>
        <a href="/billing" style="color:#94a3b8;display:block;padding:8px;text-decoration:none;">Billing</a>
        <a href="/integrations" style="color:#94a3b8;display:block;padding:8px;text-decoration:none;">Integrations</a>
      </nav>
    </aside>
    <main style="flex:1;padding:32px;">
      <h1>Settings</h1>
      <div role="tablist">
        <button role="tab" aria-selected="true" aria-controls="general-panel" id="general-tab">General</button>
        <button role="tab" aria-selected="false" aria-controls="security-panel" id="security-tab">Security</button>
        <button role="tab" aria-selected="false" aria-controls="notif-panel" id="notif-tab">Notifications</button>
        <button role="tab" aria-selected="false" aria-controls="api-panel" id="api-tab">API Keys</button>
      </div>
      <div role="tabpanel" id="general-panel" aria-labelledby="general-tab">
        <h2>General Settings</h2>
        <form>
          <div>
            <label for="org-name">Organization Name</label>
            <input type="text" id="org-name" value="Acme Corp">
          </div>
          <div>
            <label for="timezone">Timezone</label>
            <select id="timezone">
              <option>UTC</option>
              <option selected>Europe/London</option>
              <option>America/New_York</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div>
            <span>Dark Mode</span>
            <div role="switch" aria-checked="false" tabindex="0" style="width:44px;height:24px;background:#cbd5e1;border-radius:12px;cursor:pointer;position:relative;">
              <div style="width:20px;height:20px;background:white;border-radius:50%;position:absolute;top:2px;left:2px;"></div>
            </div>
          </div>
          <div>
            <span>Email Digest</span>
            <div role="switch" aria-checked="true" tabindex="0" style="width:44px;height:24px;background:#6366f1;border-radius:12px;cursor:pointer;position:relative;">
              <div style="width:20px;height:20px;background:white;border-radius:50%;position:absolute;top:2px;right:2px;"></div>
            </div>
          </div>
          <div>
            <label for="language">Language</label>
            <select id="language">
              <option selected>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>
          <div style="display:flex;gap:8px;margin-top:16px;">
            <button type="submit" style="background:#6366f1;color:white;border:none;padding:8px 20px;border-radius:6px;">Save Changes</button>
            <button type="button" style="background:none;border:1px solid #e2e8f0;padding:8px 20px;border-radius:6px;">Cancel</button>
          </div>
        </form>
      </div>
    </main>
  </div>
</body>
</html>
```

**Expected violations:** `switch` role missing accessible label, `color-contrast` (sidebar #94a3b8 on #1e293b), switches use `<span>` not `<label>`, tab panels for security/notif/api are referenced but don't exist in DOM (`aria-controls` points to missing IDs).

---

## 12. Real-time Chat Application

```html
<html lang="en">
<head><title>Team Chat — #general</title></head>
<body style="margin:0;font-family:system-ui,sans-serif;">
  <div style="display:flex;height:100vh;">
    <aside style="width:260px;background:#1a1d21;color:#d1d2d3;padding:0;display:flex;flex-direction:column;">
      <div style="padding:16px;font-weight:bold;font-size:18px;border-bottom:1px solid #35373b;">
        <button style="background:none;border:none;color:white;font-size:18px;font-weight:bold;cursor:pointer;">Acme Team <span style="font-size:10px;">&#9660;</span></button>
      </div>
      <nav style="flex:1;overflow-y:auto;padding:8px;">
        <div style="padding:4px 8px;font-size:12px;color:#9a9b9e;text-transform:uppercase;font-weight:bold;">Channels</div>
        <a href="#general" style="display:flex;align-items:center;padding:4px 8px;color:white;text-decoration:none;background:#1164a3;border-radius:4px;"># general</a>
        <a href="#design" style="display:flex;align-items:center;padding:4px 8px;color:#d1d2d3;text-decoration:none;"># design</a>
        <a href="#engineering" style="display:flex;align-items:center;padding:4px 8px;color:#d1d2d3;text-decoration:none;"># engineering</a>
        <a href="#random" style="display:flex;align-items:center;padding:4px 8px;color:#d1d2d3;text-decoration:none;"># random</a>
        <div style="padding:4px 8px;font-size:12px;color:#9a9b9e;text-transform:uppercase;font-weight:bold;margin-top:12px;">Direct Messages</div>
        <a href="#dm-sarah" style="display:flex;align-items:center;padding:4px 8px;color:#d1d2d3;text-decoration:none;"><span style="display:inline-block;width:8px;height:8px;background:#2bac76;border-radius:50%;margin-right:8px;"></span> Sarah Chen</a>
        <a href="#dm-james" style="display:flex;align-items:center;padding:4px 8px;color:#d1d2d3;text-decoration:none;"><span style="display:inline-block;width:8px;height:8px;background:#9a9b9e;border-radius:50%;margin-right:8px;"></span> James Park</a>
      </nav>
    </aside>
    <main style="flex:1;display:flex;flex-direction:column;">
      <header style="padding:12px 20px;border-bottom:1px solid #e0e0e0;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <h1 style="font-size:18px;margin:0;"># general</h1>
          <p style="font-size:12px;color:#999;margin:0;">Company-wide announcements and updates</p>
        </div>
        <div style="display:flex;gap:8px;">
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="search.svg" width="20"></button>
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="pin.svg" width="20"></button>
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="members.svg" width="20"></button>
        </div>
      </header>
      <div role="log" aria-live="polite" aria-label="Messages in #general" style="flex:1;overflow-y:auto;padding:20px;">
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <img src="avatar-sarah.jpg" width="36" height="36" style="border-radius:4px;">
          <div>
            <div><strong>Sarah Chen</strong> <time datetime="2026-03-13T09:15:00" style="color:#999;font-size:12px;">9:15 AM</time></div>
            <p style="margin:4px 0;">Hey team! Just pushed the new accessibility audit feature to staging. Can someone review the PR?</p>
            <div style="display:flex;gap:4px;margin-top:4px;">
              <button style="background:#f0f0f0;border:1px solid #e0e0e0;border-radius:12px;padding:2px 8px;font-size:12px;cursor:pointer;">&#128077; 3</button>
              <button style="background:#f0f0f0;border:1px solid #e0e0e0;border-radius:12px;padding:2px 8px;font-size:12px;cursor:pointer;">&#128640; 1</button>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-bottom:16px;">
          <img src="avatar-james.jpg" width="36" height="36" style="border-radius:4px;">
          <div>
            <div><strong>James Park</strong> <time datetime="2026-03-13T09:22:00" style="color:#999;font-size:12px;">9:22 AM</time></div>
            <p style="margin:4px 0;">On it! I'll check the preview deploy. <a href="https://staging.acme.dev/pr-247">PR #247</a></p>
            <div style="margin-top:8px;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;max-width:400px;">
              <img src="link-preview.jpg" width="400" height="200" style="display:block;">
              <div style="padding:8px 12px;">
                <div style="font-size:12px;color:#999;">staging.acme.dev</div>
                <div style="font-weight:bold;font-size:14px;">PR #247: Add accessibility audit feature</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding:12px 20px;border-top:1px solid #e0e0e0;">
        <div style="display:flex;align-items:center;border:1px solid #ccc;border-radius:8px;padding:8px 12px;">
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="attach.svg" width="20"></button>
          <input type="text" placeholder="Message #general" style="flex:1;border:none;outline:none;font-size:14px;margin:0 8px;">
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="emoji.svg" width="20"></button>
          <button style="background:none;border:none;cursor:pointer;padding:4px;"><img src="send.svg" width="20"></button>
        </div>
      </div>
    </main>
  </div>
</body>
</html>
```

**Expected violations:** `image-alt` (all avatars, toolbar icons, link preview), `button-name` (icon-only buttons for search/pin/members/attach/emoji/send), `label` (message input), `color-contrast` (#999 timestamps, #d1d2d3 on #1a1d21 sidebar), `region` violations.
