export default function decorate(block) {
  const rows = [...block.children];
  const configRow = rows[0];

  let variation = 'var-default';

  // Extract variation config
  if (configRow) {
    const cells = [...configRow.children];
    if (cells.length > 0) {
      const paragraphs = [...cells[0].children];
      if (paragraphs[0]) {
        const value = paragraphs[0].textContent.trim();
        if (value && value.startsWith('var-')) {
          variation = value;
        }
      }
    }
    configRow.remove();
  }

  block.classList.add(variation);

  // Process slides
  const slides = [...block.children];

  slides.forEach((slide) => {
    const cells = [...slide.children];
    if (cells.length >= 2) {
      const topSection = cells[0];
      const bottomSection = cells[1];

      const picture = topSection.querySelector('picture');

      let heading = topSection.querySelector('h1, h2, h3, h4, h5, h6');
      if (!heading) {
        const paragraphs = Array.from(topSection.querySelectorAll('p'));
        heading = paragraphs.find((p) => !p.querySelector('picture'));
      }

      let cta = bottomSection.querySelector('.button-container');
      const rawLink = bottomSection.querySelector('a');

      slide.innerHTML = '';
      slide.classList.add('carousel-slide');

      // Variation 1: var-default (Icon + Heading inline at top, Description at bottom)
      if (variation === 'var-default' || variation === 'var-alternate') {
        const top = document.createElement('div');
        top.className = 'carousel-slide-top';

        if (picture) {
          const wrapper = picture.closest('p') || picture;
          wrapper.classList.add('carousel-icon');
          top.appendChild(wrapper);
        }

        if (heading) {
          heading.classList.add('carousel-heading');
          top.appendChild(heading);
        }

        slide.appendChild(top);

        const bottom = document.createElement('div');
        bottom.className = 'carousel-slide-bottom';

        Array.from(bottomSection.children).forEach((child) => {
          if (child === cta || child.contains(rawLink)) return;
          child.classList.add('carousel-description');
          bottom.appendChild(child);
        });

        slide.appendChild(bottom);
      }

      // Variation 2: var-cta (Heading + Icon at top, Image at bottom, Whole card clickable)
      if (variation === 'var-cta') {
        const top = document.createElement('div');
        top.className = 'carousel-slide-top';

        if (heading) {
          heading.classList.add('carousel-heading');
          top.appendChild(heading);
        }

        const icon = document.createElement('span');
        icon.className = 'icon-link-fixed';
        top.appendChild(icon);

        slide.appendChild(top);

        const bottom = document.createElement('div');
        bottom.className = 'carousel-slide-bottom';

        if (picture) {
          const wrapper = picture.closest('p') || picture;
          bottom.appendChild(wrapper);
        }

        slide.appendChild(bottom);

        if (rawLink) {
          const linkOverlay = document.createElement('a');
          linkOverlay.href = rawLink.href;
          linkOverlay.className = 'card-link-overlay';
          linkOverlay.setAttribute('aria-label', rawLink.title || rawLink.textContent || 'View details');
          slide.appendChild(linkOverlay);
        }
      }

      // Variation 3: var-image (Image only, full card)
      if (variation === 'var-image') {
        if (picture) {
          const wrapper = picture.closest('p') || picture;
          slide.appendChild(wrapper);
        }
      }
    }
  });
}
