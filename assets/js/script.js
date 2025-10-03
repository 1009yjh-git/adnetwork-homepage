document.addEventListener('DOMContentLoaded', () => {

      // ===================================================================
      // 1. Mobile Menu Toggle
      // ===================================================================
      const mobileMenuButton = document.getElementById('mobile-menu-button');
      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
          mobileMenu.classList.toggle('hidden');
        });
      }

      // ===================================================================
      // 2. Smooth Scrolling for Nav Links
      // ===================================================================
      document.querySelectorAll('a[data-scroll-to]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('data-scroll-to');
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
            
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
              mobileMenu.classList.add('hidden');
            }
          }
        });
      });

      // ===================================================================
      // 3. GNI Workshop Video Playlist
      // ===================================================================
      const gniPlaylist = document.getElementById('gni-playlist');
      const gniVideoPlayer = document.getElementById('gni-video-player');
      if (gniPlaylist && gniVideoPlayer) {
        gniPlaylist.addEventListener('click', (e) => {
          const button = e.target.closest('button');
          if (button && button.dataset.videoId) {
            gniVideoPlayer.src = `https://www.youtube.com/embed/${button.dataset.videoId}`;
            gniPlaylist.querySelector('.active')?.classList.remove('active');
            button.parentElement.classList.add('active');
          }
        });
      }

      // ===================================================================
      // 4. Premium Partner Services Tabs
      // ===================================================================
      const serviceTabsContainer = document.querySelector('.service-tabs');
      if (serviceTabsContainer) {
        serviceTabsContainer.addEventListener('click', (e) => {
          const tabButton = e.target.closest('.service-tab');
          if (tabButton && !tabButton.classList.contains('active')) {
            const tabId = tabButton.dataset.tab;
            
            serviceTabsContainer.querySelector('.active')?.classList.remove('active');
            const currentPane = document.querySelector('.service-pane.active');
            if(currentPane) currentPane.classList.remove('active');

            tabButton.classList.add('active');
            const newPane = document.getElementById(`tab-${tabId}`);
            if(newPane) newPane.classList.add('active');
          }
        });
      }

      // ===================================================================
      // 5. Company History Timeline Tooltip
      // ===================================================================
      const timelineGraph = document.querySelector('.timeline-graph');
      const tooltip = document.getElementById('tooltip');
      if (timelineGraph && tooltip) {
        timelineGraph.querySelectorAll('circle.point').forEach(point => {
          point.addEventListener('mouseover', (e) => {
            const year = e.target.getAttribute('data-year');
            const text = e.target.getAttribute('data-text');
            tooltip.innerHTML = `<strong>${year}</strong><p>${text}</p>`;
            tooltip.style.display = 'block';
          });
          point.addEventListener('mousemove', (e) => {
              const rect = timelineGraph.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              tooltip.style.left = `${x + 15}px`;
              tooltip.style.top = `${y + 15}px`;
          });
          point.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
          });
        });
      }

      // ===================================================================
      // 6. Link Click Handler (Event Delegation)
      // ===================================================================
      const modalOverlay = document.getElementById('partnerInfoModal');
      const modalTitle = document.getElementById('modalTitle');
      const modalDescription = document.getElementById('modalDescription');
      const modalLink = document.getElementById('modalLink');
      const closeModalBtn = document.getElementById('modalCloseBtn');

      const openModal = (link) => {
        if (!modalOverlay) return;
        modalTitle.textContent = link.dataset.title || '';
        modalDescription.textContent = link.dataset.description || '';
        modalLink.href = link.href || '#';
        modalOverlay.style.display = 'flex';
      };

      const closeModal = () => {
        if (!modalOverlay) return;
        modalOverlay.style.display = 'none';
      };

      if (modalOverlay) {
        closeModalBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
            closeModal();
          }
        });
      }

      const handleDeviceSpecificRedirect = (link) => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        let targetUrl = link.dataset.pcUrl || '#';
        if (/android/i.test(userAgent)) {
          targetUrl = link.dataset.aosUrl || link.dataset.pcUrl || '#';
        } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
          targetUrl = link.dataset.iosUrl || link.dataset.pcUrl || '#';
        }
        if (targetUrl && targetUrl !== '#') {
          window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
      };

      // This is the main delegated listener
      document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Check for modal link within the specific carousel
        if (link.closest('.logo-swiper') && link.classList.contains('partner-logo-link')) {
          if (link.dataset.title && link.dataset.description) {
            e.preventDefault();
            openModal(link);
            return; // Handled
          }
        }

        // Check for device-specific link
        if (link.classList.contains('service-partner-link') && link.dataset.pcUrl) {
          e.preventDefault();
          handleDeviceSpecificRedirect(link);
          return; // Handled
        }
      });

      // ===================================================================
      // 7. Swiper Initializations
      // ===================================================================
      // Config for forward rows
      const forwardConfig = {
        loop: true,
        freeMode: true,
        slidesPerView: 'auto',
        spaceBetween: 15,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        speed: 4000,
      };

      new Swiper('.logo-swiper', forwardConfig);

      const partnerSwipers = document.querySelectorAll('.logo-wall-swiper .swiper-wrapper');
      partnerSwipers.forEach(swiper => {
          swiper.addEventListener('mouseenter', () => {
              swiper.style.animationPlayState = 'paused';
          });
          swiper.addEventListener('mouseleave', () => {
              swiper.style.animationPlayState = 'running';
          });
      });

      // ===================================================================
      // 8. Floating Button Visibility
      // ===================================================================
      const contactSection = document.getElementById('contact');
      const floatingBtn = document.getElementById('floating-contact-btn');

      if (contactSection && floatingBtn) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              floatingBtn.classList.add('hidden');
            } else {
              floatingBtn.classList.remove('hidden');
            }
          });
        }, {
          root: null, // relative to the viewport
          threshold: 0.1 // 10% of the item is visible
        });

        observer.observe(contactSection);
      }
    });