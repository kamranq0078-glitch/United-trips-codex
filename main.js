const WA_NUMBER = "918899166414";

const WA_MESSAGES = {
  "/": "Hello United Arts & Crafts Holidays! I found your website and want to enquire about a Kashmir trip. Can you help me?",
  "/packages": "Hello! I'm browsing your Kashmir tour packages. Can you help me choose the right one?",
  "/contact": "Hello United Arts & Crafts Holidays! I'd like a free custom Kashmir itinerary quote."
};

function buildWhatsAppLink(message) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function pageWhatsAppMessage() {
  const pathname = window.location.pathname
    .replace(/index\.html$/, "")
    .replace(/\.html$/, "")
    .replace(/\/$/, "") || "/";
  if (pathname.startsWith("/packages/")) {
    const packageName = document.body.dataset.packageName || "this package";
    return `Hello! I'm interested in the ${packageName} package. Can you share more details and availability?`;
  }

  if (pathname.startsWith("/destinations/")) {
    const destinationName = document.body.dataset.destinationName || "this destination";
    return `Hello! I'm planning to visit ${destinationName}. What packages do you recommend?`;
  }

  return WA_MESSAGES[pathname] || WA_MESSAGES["/"];
}

function setWhatsAppLinks() {
  const href = buildWhatsAppLink(pageWhatsAppMessage());
  document.querySelectorAll(".whatsapp-link").forEach((link) => {
    link.href = href;
  });
}

function initProgressBar() {
  const bar = document.querySelector(".progress-bar");
  if (!bar) return;
  requestAnimationFrame(() => {
    bar.style.width = "100%";
    setTimeout(() => {
      bar.style.opacity = "0";
    }, 400);
  });
}

function initNavbarState() {
  const nav = document.querySelector(".site-header");
  if (!nav) return;
  const update = () => {
    nav.style.background = window.scrollY > 30 ? "rgba(11, 20, 32, 0.86)" : "rgba(11, 20, 32, 0.94)";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const end = Number(el.dataset.count);
      let value = 0;
      const tick = () => {
        value += Math.max(1, Math.ceil(end / 24));
        if (value >= end) {
          el.textContent = `${end}${el.dataset.suffix || ""}`;
          return;
        }
        el.textContent = `${value}${el.dataset.suffix || ""}`;
        window.setTimeout(tick, 40);
      };
      tick();
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((counter) => observer.observe(counter));
}

function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = tabs.querySelectorAll("[data-tab-target]");
    const panels = tabs.querySelectorAll("[data-tab-panel]");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.dataset.tabTarget;
        buttons.forEach((item) => item.classList.toggle("is-active", item === button));
        panels.forEach((panel) => panel.classList.toggle("is-active", panel.id === target));
      });
    });
  });
}

function initPackageFilters() {
  const filterForm = document.querySelector("[data-package-filter]");
  const cards = document.querySelectorAll("[data-package-card]");
  if (!filterForm || !cards.length) return;
  const applyFilters = () => {
    const data = new FormData(filterForm);
    const filters = Object.fromEntries(data.entries());
    cards.forEach((card) => {
      const matches = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return (card.dataset[key] || "").includes(value);
      });
      card.hidden = !matches;
    });
  };
  filterForm.addEventListener("change", applyFilters, { passive: true });
}

function initMapLoaders() {
  document.querySelectorAll("[data-map-embed]").forEach((wrapper) => {
    const button = wrapper.querySelector("button");
    const activate = () => {
      if (wrapper.dataset.loaded === "true") return;
      wrapper.dataset.loaded = "true";
      const iframe = document.createElement("iframe");
      iframe.src = wrapper.dataset.mapEmbed;
      iframe.loading = "lazy";
      iframe.width = "100%";
      iframe.height = "360";
      iframe.style.border = "0";
      iframe.setAttribute("allowfullscreen", "");
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      wrapper.innerHTML = "";
      wrapper.appendChild(iframe);
    };
    button?.addEventListener("click", activate);
  });
}

function initExitIntent() {
  if (window.innerWidth < 1024) return;
  const box = document.querySelector(".exit-intent");
  if (!box) return;
  let shown = false;
  document.addEventListener("mouseout", (event) => {
    if (shown || event.clientY > 10) return;
    shown = true;
    box.classList.add("is-visible");
  });
}

function initBookingCalculator() {
  document.querySelectorAll("[data-booking-widget]").forEach((widget) => {
    const price = Number(widget.dataset.price || "0");
    const adults = widget.querySelector("[name='adults']");
    const children = widget.querySelector("[name='children']");
    const total = widget.querySelector("[data-total]");
    const update = () => {
      const adultCount = Number(adults?.value || "0");
      const childCount = Number(children?.value || "0");
      const sum = adultCount * price + childCount * Math.round(price * 0.65);
      total.textContent = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(sum || price);
    };
    adults?.addEventListener("change", update);
    children?.addEventListener("change", update);
    update();
  });
}

function initYearStamp() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear().toString();
  });
}

function initContactForm() {
  const form = document.querySelector('form');
  if (!form || window.location.pathname.indexOf('contact') === -1) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const travellers = document.getElementById('travellers')?.value || '';
    const dates = document.getElementById('dates')?.value || '';
    const budget = document.getElementById('budget')?.value || '';
    const interest = document.getElementById('interest')?.value || '';
    const heard = document.getElementById('heard')?.value || '';
    const message = document.getElementById('message')?.value || '';

    const waMessage = `
Hello United Arts & Crafts Holidays!

I found your website and would like to enquire about a Kashmir trip.

*My Details:*
Name: ${name}
Email: ${email}
Phone: ${phone}
No. of Travellers: ${travellers}
Travel Dates: ${dates}
Budget Range: ${budget}
Interested In: ${interest}
How I heard about you: ${heard}

*Message / Special Requests:*
${message}

Please get back to me at your earliest convenience. Thank you!
    `.trim();

    const encodedMessage = encodeURIComponent(waMessage);
    const waURL = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

    window.open(waURL, '_blank', 'noopener,noreferrer');

    form.innerHTML = `
      <div style="text-align:center; padding:2rem;">
        <div style="font-size:48px; margin-bottom:1rem;">✓</div>
        <h3 style="font-family:inherit; margin-bottom:0.5rem;">
          Opening WhatsApp...
        </h3>
        <p style="color:#5a6478; font-size:14px;">
          Your enquiry details have been pre-filled in WhatsApp.
          Just press Send and we will reply within 2 hours.
        </p>
        <p style="color:#5a6478; font-size:13px; margin-top:1rem;">
          WhatsApp not opening?
          <a href="${waURL}" style="color:#0e6b6b;">
            Click here to open manually
          </a>
        </p>
      </div>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initProgressBar();
  initNavbarState();
  initCounters();
  initTabs();
  initPackageFilters();
  initMapLoaders();
  initExitIntent();
  initBookingCalculator();
  initYearStamp();
  initContactForm();
  setWhatsAppLinks();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
