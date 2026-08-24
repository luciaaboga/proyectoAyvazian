document.addEventListener('DOMContentLoaded', function () {

  // ---- Materialize component inits ----
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

  // ---- Scroll reveal animations ----
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

  // ---- Back to top button ----
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });

  // ---- Contact form demo submit ----
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    M.toast({ html: '¡Gracias! Este formulario es solo una demostración de interfaz.', classes: 'rounded', displayLength: 3500 });
    form.reset();
    M.updateTextFields();
  });

});