document.addEventListener('DOMContentLoaded', function () {

  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Collapsible.init(document.querySelectorAll('.collapsible'));
  M.FormSelect.init(document.querySelectorAll('select'));
  M.updateTextFields();
  M.Carousel.init(document.querySelectorAll('.carousel'), {
    dist: -60,
    shift: 30,
    padding: 40,
    fullWidth: false,
    indicators: true
  });

  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');

    if (!nameField.value.trim() || !emailField.value.trim() || !phoneField.value.trim()) {
      M.toast({ html: 'Por favor completá nombre, teléfono y email antes de enviar.', classes: 'rounded red darken-2', displayLength: 3500 });
      return;
    }

    M.toast({ html: '¡Gracias! Este formulario es solo una demostración de interfaz.', classes: 'rounded', displayLength: 3500 });
    form.reset();
    M.updateTextFields();
  });

  const eraAudios = document.querySelectorAll('.era-audio audio');
  eraAudios.forEach(audio => {
    audio.addEventListener('play', () => {
      eraAudios.forEach(other => {
        if (other !== audio) other.pause();
      });
    });
  });

  const galleryTrack = document.getElementById('erasGalleryTrack');

  if (galleryTrack) {
    const originalCards = Array.from(galleryTrack.querySelectorAll('.gallery-card'));

    if (originalCards.length) {
      const setSize = originalCards.length;

      const fragBefore = document.createDocumentFragment();
      originalCards.forEach(card => fragBefore.appendChild(card.cloneNode(true)));
      galleryTrack.insertBefore(fragBefore, galleryTrack.firstChild);

      const fragAfter = document.createDocumentFragment();
      originalCards.forEach(card => fragAfter.appendChild(card.cloneNode(true)));
      galleryTrack.appendChild(fragAfter);

      const galleryCards = Array.from(galleryTrack.querySelectorAll('.gallery-card'));
      const prevBtn = document.querySelector('.gallery-nav-prev');
      const nextBtn = document.querySelector('.gallery-nav-next');

      function getClosestIndex() {
        const trackRect = galleryTrack.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;

        let closestIndex = 0;
        let closestDist = Infinity;

        galleryCards.forEach((card, i) => {
          const cardCenterInTrack = card.offsetLeft + card.offsetWidth / 2;
          const cardCenterViewport = cardCenterInTrack - galleryTrack.scrollLeft + trackRect.left;
          const dist = Math.abs(cardCenterViewport - trackCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = i;
          }
        });

        return closestIndex;
      }

      function updateActiveCard() {
        const closestIndex = getClosestIndex();
        galleryCards.forEach((card, i) => card.classList.toggle('is-active', i === closestIndex));
        return closestIndex;
      }

      function enforceLoop() {
        const currentIndex = getClosestIndex();
        let targetIndex = null;

        if (currentIndex < setSize) {
          targetIndex = currentIndex + setSize;
        } else if (currentIndex >= setSize * 2) {
          targetIndex = currentIndex - setSize;
        }

        if (targetIndex !== null) {
          const fromCard = galleryCards[currentIndex];
          const toCard = galleryCards[targetIndex];
          galleryTrack.scrollLeft += (toCard.offsetLeft - fromCard.offsetLeft);
        }

        updateActiveCard();
      }

      let scrollTimeout;
      galleryTrack.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateActiveCard);
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(enforceLoop, 120);
      }, { passive: true });

      galleryCards.forEach(card => {
        card.addEventListener('click', () => {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
      });

      function scrollByCard(direction) {
        const currentIndex = getClosestIndex();
        const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        const target = galleryCards[targetIndex];
        if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
      prevBtn?.addEventListener('click', () => scrollByCard('prev'));
      nextBtn?.addEventListener('click', () => scrollByCard('next'));

      function centerInitialCard() {
        const middleIndex = setSize + Math.floor((setSize - 1) / 2);
        galleryCards[middleIndex].scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
        updateActiveCard();
      }

      requestAnimationFrame(centerInitialCard);
      window.addEventListener('resize', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveCard, 100);
      });
    }
  }

  const sidebarFacts = [
    "Fearless fue el primer álbum en ganar el Grammy al Álbum del Año con una artista country como solista.",
    "1989 (Taylor's Version) incluye pistas 'From The Vault' que nunca se habían lanzado antes.",
    "folklore se escribió y grabó casi por completo durante 2020, en colaboración remota con Aaron Dessner.",
    "reputation fue el álbum más vendido de 2017 en Estados Unidos.",
    "Lover fue el primer álbum lanzado bajo su propio sello, Taylor Swift Productions.",
    "Midnights se convirtió en el álbum más vendido de 2022 en su primera semana."
  ];
  let sidebarFactIndex = 0;
  const sidebarFactText = document.getElementById('sidebarFactText');
  if (sidebarFactText) {
    setInterval(() => {
      sidebarFactIndex = (sidebarFactIndex + 1) % sidebarFacts.length;
      sidebarFactText.style.opacity = 0;
      setTimeout(() => {
        sidebarFactText.textContent = sidebarFacts[sidebarFactIndex];
        sidebarFactText.style.opacity = 1;
      }, 300);
    }, 6000);
  }

  const sidebarLinks = document.querySelectorAll('.desktop-sidebar .sidebar-link');
  if (sidebarLinks.length) {
    const sections = Array.from(sidebarLinks)
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(sec => sectionObserver.observe(sec));
  }

});
  const shareBtn = document.getElementById('shareBtn');
  const copyLinkBtn = document.getElementById('copyLinkBtn');

  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'The Eras Anthology',
        text: 'Un recorrido por las eras musicales — ¡mirá esta página!',
        url: window.location.href
      };
      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
        }
      } else {
        M.toast({ html: 'Tu navegador no soporta compartir nativo. Usá "Copiar link".', classes: 'rounded', displayLength: 3000 });
      }
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(window.location.href);
        M.toast({ html: '¡Link copiado al portapapeles!', classes: 'rounded', displayLength: 2500 });
      } catch (err) {
        M.toast({ html: 'No se pudo copiar el link.', classes: 'rounded red darken-2', displayLength: 2500 });
      }
    });
  }