(function() {
  'use strict';

  var switcher = document.querySelector('.language-switch');
  if (!switcher) return;
  var trigger = switcher.querySelector('.language-switch-trigger');

  /** Keep the button state in sync with the visible options.
   * @return {void}
   */
  function syncExpanded() {
    var expanded = !switcher.classList.contains('is-collapsed') ||
      switcher.classList.contains('is-open') ||
      (window.matchMedia('(hover: hover)').matches && switcher.matches(':hover')) ||
      switcher.matches(':focus-within');
    trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  /** Collapse the switcher after the first page scroll.
   * @return {void}
   */
  function collapse() {
    switcher.classList.add('is-collapsed');
    syncExpanded();
    window.removeEventListener('scroll', collapse);
  }

  if (window.scrollY > 0) {
    collapse();
  }
  else {
    window.addEventListener('scroll', collapse, {passive: true});
  }

  switcher.addEventListener('mouseenter', syncExpanded);
  switcher.addEventListener('mouseleave', syncExpanded);
  switcher.addEventListener('focusin', syncExpanded);
  switcher.addEventListener('focusout', function() {
    setTimeout(syncExpanded, 0);
  });

  trigger.addEventListener('click', function(event) {
    if (!switcher.classList.contains('is-collapsed')) return;
    if (window.matchMedia('(hover: hover)').matches) {
      if (event.detail > 0) trigger.blur();
      syncExpanded();
      return;
    }
    switcher.classList.toggle('is-open');
    trigger.blur();
    syncExpanded();
  });

  document.addEventListener('pointerdown', function(event) {
    if (!switcher.contains(event.target)) {
      switcher.classList.remove('is-open');
      syncExpanded();
    }
  });
})();
