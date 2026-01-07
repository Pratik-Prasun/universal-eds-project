import { loadScript } from '../../scripts/aem.js';

export default async function decorate(block) {
  // PART 1: DOM MANIPULATION (Constructing the Cards)
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

      const cta = bottomSection.querySelector('.button-container');
      const rawLink = bottomSection.querySelector('a');

      slide.innerHTML = '';
      slide.classList.add('carousel-slide');

      // Variation 1 & 4: (Icon + Heading inline at top, Description at bottom)
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

      // Variation 2: var-cta (Heading + Icon at top, Image at bottom)
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

      // Variation 3: var-image (Image only)
      if (variation === 'var-image') {
        if (picture) {
          const wrapper = picture.closest('p') || picture;
          slide.appendChild(wrapper);
        }
      }
    }
  });

  // PART 2: SLICK CAROUSEL INITIALIZATION (The Engine)

  // 1. Load jQuery (Only if not already present)
  if (!window.jQuery) {
    await loadScript('/scripts/jquery.min.js');
  }

  // 2. Load Slick JS
  await loadScript('/scripts/slick.min.js');

  // 3. Initialize live site setting
  const initCarousel = () => {
    window.jQuery(block).slick({
      dots: true,
      infinite: true,
      speed: 300,
      slidesToShow: 1, // As requested
      slidesToScroll: 1,
      // Custom HTML for Arrows to match live site
      prevArrow: '<button type="button" class="slick-prev"><span class="slick-prev-icon" aria-hidden="true"></span><span class="slick-sr-only">Previous</span></button>',
      nextArrow: '<button type="button" class="slick-next"><span class="slick-next-icon" aria-hidden="true"></span><span class="slick-sr-only">Next</span></button>',
      // Custom HTML for Dots to match live site
      customPaging(slider, i) {
        return `<button type="button"><span class="slick-dot-icon" aria-hidden="true"></span><span class="slick-sr-only">Go to slide ${i + 1}</span></button>`;
      },
      responsive: [
        {
          breakpoint: 992, // Tablet breakpoint from live code
          settings: {
            arrows: false, // Hides arrows on mobile/tablet
          },
        },
      ],
    });
  };

  initCarousel();
}
