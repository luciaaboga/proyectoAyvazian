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

      function centerCardInTrack(card, behavior = 'auto') {
        const targetLeft = card.offsetLeft + card.offsetWidth / 2 - galleryTrack.clientWidth / 2;
        galleryTrack.scrollTo({ left: targetLeft, behavior });
      }

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
        card.addEventListener('click', () => centerCardInTrack(card, 'smooth'));
      });

      function scrollByCard(direction) {
        const currentIndex = getClosestIndex();
        const targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        const target = galleryCards[targetIndex];
        if (target) centerCardInTrack(target, 'smooth');
        }
      prevBtn?.addEventListener('click', () => scrollByCard('prev'));
      nextBtn?.addEventListener('click', () => scrollByCard('next'));

      function centerInitialCard() {
        const middleIndex = setSize + Math.floor((setSize - 1) / 2);
        centerCardInTrack(galleryCards[middleIndex], 'auto');
        updateActiveCard();
      }

      requestAnimationFrame(centerInitialCard);
      window.addEventListener('resize', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveCard, 100);
      });
    }
  }

});