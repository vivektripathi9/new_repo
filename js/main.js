/* Godrej Florenne – interactions */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ——— Mobile menu ——— */
  const menuToggle = $("#menuToggle");
  const sideMenu = $("#sideMenu");
  const menuOverlay = $("#menuOverlay");
  const menuClose = $("#menuClose");

  function openMenu() {
    sideMenu.hidden = false;
    menuOverlay.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  function closeMenu() {
    sideMenu.hidden = true;
    menuOverlay.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  menuToggle?.addEventListener("click", openMenu);
  menuClose?.addEventListener("click", closeMenu);
  menuOverlay?.addEventListener("click", closeMenu);

  $$(".side-menu a").forEach((a) => {
    a.addEventListener("click", () => {
      if (!a.classList.contains("js-open-modal")) closeMenu();
      else closeMenu();
    });
  });

  /* ——— Hero slider ——— */
  const heroSlides = $$("#heroSlider .slide");
  let heroIndex = 0;

  function showHero(i) {
    heroSlides.forEach((s, n) => s.classList.toggle("active", n === i));
  }

  if (heroSlides.length > 1) {
    setInterval(() => {
      heroIndex = (heroIndex + 1) % heroSlides.length;
      showHero(heroIndex);
    }, 4000);
  }

  /* ——— Scroll reveal ——— */
  const revealEls = $$(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => revealObs.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ——— Location tabs ——— */
  $$(".loc-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      $$(".loc-tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      $$(".loc-panel").forEach((p) => p.classList.remove("active"));
      const panel = $(`#tab-${tab.dataset.tab}`);
      if (panel) panel.classList.add("active");
    });
  });

  /* ——— Enquiry modal ——— */
  const modal = $("#enquiryModal");

  function openModal(e) {
    e?.preventDefault?.();
    modal.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeModal() {
    modal.hidden = true;
    if (sideMenu.hidden) document.body.classList.remove("no-scroll");
  }

  $$(".js-open-modal").forEach((el) => el.addEventListener("click", openModal));
  $$(".js-close-modal").forEach((el) => el.addEventListener("click", closeModal));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
      closeMenu();
      closeLightbox();
    }
  });

  /* Auto-open enquiry modal once after short delay (like original) */
  setTimeout(() => {
    if (modal.hidden && !sessionStorage.getItem("gf_modal_shown")) {
      openModal();
      sessionStorage.setItem("gf_modal_shown", "1");
    }
  }, 3500);

  /* ——— Forms ——— */
  const toast = $("#toast");

  function showToast(msg) {
    toast.textContent = msg || "Thank you! We will contact you shortly.";
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 3200);
  }

  function handleForm(e) {
    e.preventDefault();
    const form = e.target;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const phone = form.querySelector('[name="phone"]');
    if (phone && !/^[6-9]\d{9}$/.test(phone.value.replace(/\s+/g, ""))) {
      phone.setCustomValidity("Enter a valid 10-digit mobile number");
      phone.reportValidity();
      phone.setCustomValidity("");
      return;
    }
    form.reset();
    closeModal();
    showToast();
  }

  $$(".js-form").forEach((f) => f.addEventListener("submit", handleForm));

  /* ——— Lightbox ——— */
  const lb = $("#lightbox");
  const lbImg = $("#lightboxImg");
  let lbItems = [];
  let lbIndex = 0;

  function openLightbox(items, index) {
    lbItems = items;
    lbIndex = index;
    lbImg.src = lbItems[lbIndex];
    lb.hidden = false;
    document.body.classList.add("no-scroll");
  }

  function closeLightbox() {
    lb.hidden = true;
    lbImg.src = "";
    if (modal.hidden && sideMenu.hidden) document.body.classList.remove("no-scroll");
  }

  function lbNav(dir) {
    if (!lbItems.length) return;
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    lbImg.src = lbItems[lbIndex];
  }

  $$(".lightbox").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const group = link.dataset.gallery || "default";
      const groupLinks = $$(`.lightbox[data-gallery="${group}"]`);
      const items = groupLinks.map((a) => a.getAttribute("href"));
      const index = groupLinks.indexOf(link);
      openLightbox(items, index);
    });
  });

  $(".lb-close")?.addEventListener("click", closeLightbox);
  $(".lb-prev")?.addEventListener("click", () => lbNav(-1));
  $(".lb-next")?.addEventListener("click", () => lbNav(1));
  lb?.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  /* ——— Smooth scroll offset for hash links ——— */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = $(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* Open amenities if hash present */
  if (location.hash === "#amenities") {
    requestAnimationFrame(() => {
      $("#amenities")?.scrollIntoView({ behavior: "smooth" });
    });
  }
})();
