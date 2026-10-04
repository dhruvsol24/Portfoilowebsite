/**
 * ============================================================================
 * VEX PROTOCOL // CORE SPATIAL ENGINE & INTERACTION ORCHESTRATOR
 * Vanilla ES6+ - Zero frameworks, zero libraries, zero build tools.
 * ============================================================================
 */

(function () {
  'use strict';

  // --- STATE SYSTEM ---
  const state = {
    activeSectionIndex: 0,
    sections: ['section-hero', 'section-about', 'section-projects', 'section-skills', 'section-contact'],
    sectionLabels: ['01. VOID', '02. PROTOCOL', '03. ARTIFACTS', '04. MATRIX', '05. DISPATCH'],
    
    // Mouse & Camera Coordinates
    cursor: { x: window.innerWidth / 2, y: window.innerHeight / 2, targetX: window.innerWidth / 2, targetY: window.innerHeight / 2 },
    camera: { rx: 0, ry: 0, targetRx: 0, targetRy: 0 },
    drag: { isDragging: false, startX: 0, startY: 0, rotX: 0, rotY: 0 },
    
    // Modes
    zeroGravity: false,
    currentTheme: 'void',
    isTransitioning: false,
    
    // Spring Widget State
    spring: { isDragging: false, startX: 0, startY: 0, curX: 0, curY: 0, vx: 0, vy: 0 },
    
    // FPS Monitor
    lastFpsTime: performance.now(),
    frameCount: 0,
    fps: 60
  };

  // --- DOM SELECTORS ---
  const DOM = {
    html: document.documentElement,
    body: document.body,
    viewport: document.getElementById('viewport-stage'),
    worldStage: document.getElementById('spatial-world-stage'),
    
    // Custom Cursor
    cursorDot: document.getElementById('custom-cursor'),
    cursorFollower: document.getElementById('custom-cursor-follower'),
    cursorLabel: document.getElementById('cursor-label'),
    
    // HUD Elements
    brandLogo: document.getElementById('brand-logo'),
    systemStatus: document.getElementById('system-status-text'),
    audioBtn: document.getElementById('audio-toggle-btn'),
    audioIcon: document.getElementById('audio-icon'),
    audioLabel: document.getElementById('audio-label'),
    dimensionBtn: document.getElementById('dimension-toggle-btn'),
    dimensionIcon: document.getElementById('dimension-icon'),
    dimensionLabel: document.getElementById('dimension-label'),
    zeroGBtn: document.getElementById('zerog-toggle-btn'),
    zeroGLabel: document.getElementById('zerog-label'),
    shortcutsBtn: document.getElementById('shortcuts-toggle-btn'),
    
    // Telemetry Readouts
    telemetrySection: document.getElementById('telemetry-section'),
    telemetryCursor: document.getElementById('telemetry-cursor'),
    telemetryAngles: document.getElementById('telemetry-angles'),
    
    // Navigation
    orbitalNavBtns: document.querySelectorAll('.nav-node-btn'),
    mobileDockBtns: document.querySelectorAll('.mobile-dock-btn'),
    spatialSections: document.querySelectorAll('.spatial-section'),
    
    // Hero Hypercube
    hypercubeWrapper: document.getElementById('hypercube-interactive'),
    hypercubeMesh: document.getElementById('hypercube-mesh'),
    heroCtaProjects: document.getElementById('hero-cta-projects'),
    heroCtaContact: document.getElementById('hero-cta-contact'),
    
    // About Lab Widgets
    springBtn: document.getElementById('lab-spring-btn'),
    springTensionVal: document.getElementById('spring-tension-val'),
    radiusSlider: document.getElementById('lab-radius-slider'),
    radiusVal: document.getElementById('lab-radius-val'),
    glowVal: document.getElementById('lab-glow-val'),
    ripplePad: document.getElementById('lab-ripple-pad'),
    rippleCountVal: document.getElementById('ripple-count-val'),
    switchRail: document.getElementById('lab-switch-rail'),
    switchPill: document.getElementById('lab-switch-pill'),
    switchOptionBtns: document.querySelectorAll('.switch-option-btn'),
    switchStateVal: document.getElementById('switch-state-val'),
    
    // Projects Deck
    projectCards: document.querySelectorAll('.project-card-3d'),
    projectTriggers: document.querySelectorAll('[data-project-trigger]'),
    
    // Blueprint Modal
    blueprintModal: document.getElementById('blueprint-modal'),
    blueprintModalBox: document.getElementById('blueprint-modal-box'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalProjectId: document.getElementById('modal-project-id'),
    modalTitle: document.getElementById('modal-title'),
    modalChallengeText: document.getElementById('modal-challenge-text'),
    modalArchText: document.getElementById('modal-arch-text'),
    modalMetricsText: document.getElementById('modal-metrics-text'),
    modalTabBtns: document.querySelectorAll('.modal-tab-btn'),
    modalTabContents: document.querySelectorAll('.modal-tab-content'),
    
    // Skills Matrix
    matrixFilterBtns: document.querySelectorAll('.matrix-filter-btn'),
    skillChips: document.querySelectorAll('.skill-matrix-chip'),
    
    // Contact Terminal
    terminalForm: document.getElementById('transmission-form'),
    inputSender: document.getElementById('input-sender'),
    inputContact: document.getElementById('input-contact'),
    inputPayload: document.getElementById('input-payload'),
    transmitBtn: document.getElementById('btn-transmit-payload'),
    transmitBtnText: document.getElementById('transmit-btn-text'),
    freqBtns: document.querySelectorAll('.frequency-btn'),
    telemetryCodeScreen: document.getElementById('telemetry-code-screen'),
    packetStatus: document.getElementById('packet-status'),
    terminalClock: document.getElementById('terminal-clock'),
    emailDirectLink: document.getElementById('email-direct-link'),
    
    // Shortcuts Dialog
    shortcutsDialog: document.getElementById('shortcuts-dialog'),
    shortcutsCloseBtn: document.getElementById('shortcuts-close-btn')
  };

  // --- PROJECT DATA ARCHIVE FOR 3D BLUEPRINT MODAL ---
  const PROJECT_DATA = {
    aether: {
      id: 'ART_01',
      title: 'AETHER OS // SPATIAL MR INTERFACE',
      challenge: 'Legacy 2D graphical user interfaces rely heavily on flat physical bounding boxes. In a true mixed-reality spatial computing environment, flat floating windows induce visual fatigue and lack proprioceptive depth. Users need physical friction and gaze-assisted precision to control dense spatial workspaces without hand strain.',
      architecture: 'Engineered a hybrid gaze-assisted micro-gestural targeting protocol. By projecting a conical raycast with parabolic falloff, target selection accuracy increased by 42% over raw finger tracking. Integrated depth-scaled typography tokens that automatically recalibrate visual angle and legibility across 0.5m to 5.0m focal distances.',
      metrics: 'Achieved 4.2ms glass-to-glass input latency, 99.4% gestural target accuracy, and received the Red Dot Design Award 2025. Adopted as the core interface layer across 4 enterprise spatial computing pilot programs.',
      specs: {
        fov: '110° STEREOSCOPIC',
        latency: '< 4.2 MILLISECONDS',
        hardware: 'CUSTOM WAVEGUIDE XR'
      }
    },
    synapse: {
      id: 'ART_02',
      title: 'SYNAPSE ENGINE // ENTERPRISE DESIGN TOKENS',
      challenge: 'Managing cross-platform design cohesion across 14 decoupled enterprise applications caused severe token drift, accessibility regressions, and weeks of engineering overhead per rebranding cycle. Teams lacked a single mathematical source of truth for dynamic elevation, contrast ratios, and spatial density.',
      architecture: 'Created an autonomous AST compiler that parses W3C design tokens into multi-platform targets (CSS Custom Properties, React Native, Swift UI, Android Jetpack Compose). Built an automated accessibility gate that tests contrast in CI/CD against ambient lighting simulation matrices.',
      metrics: 'Eliminated 340+ hours of annual token maintenance per squad, reduced component QA regressions by 84%, and achieved 99.8% design token adoption across 2,400+ product engineers worldwide.',
      specs: {
        fov: 'MULTI-BRAND (14 SUITES)',
        latency: 'ZERO-LATENCY SYNC',
        hardware: 'WEB / NATIVE / EMBEDDED'
      }
    },
    vektor: {
      id: 'ART_03',
      title: 'VEKTOR AUDIO // HARDWARE TOUCH INTERACTION',
      challenge: 'Modern digital audio workstations offer infinite power but suffer from lifeless glass interfaces that disconnect electronic musicians from muscle memory. The goal was to build a touch-screen synthesizer UI with the tactile intimacy and mechanical predictability of vintage analog modular instruments.',
      architecture: 'Designed a high-framerate DSP visualization engine running at 120 FPS. Created non-linear rotary dials that incorporate variable rotational resistance based on parameter sensitivity, coupled with custom audio-visual feedback loops that telegraph harmonic saturation through real-time waveform deformation.',
      metrics: 'Adopted by 180,000+ electronic music producers worldwide with a 4.9/5.0 average community rating. Honored by the Audio Engineering Society for groundbreaking tactile UI ergonomics.',
      specs: {
        fov: 'ULTRA-WIDE TOUCH DISPLAY',
        latency: '< 1.8MS DSP BUFFER',
        hardware: 'CUSTOM MOTORIZED CONSOLE'
      }
    },
    chronos: {
      id: 'ART_04',
      title: 'CHRONOS COGNITION // 4D SPATIAL KNOWLEDGE GRAPH',
      challenge: 'Complex strategic intelligence analysts were overwhelmed by hundreds of thousands of disconnected documents, temporal events, and entity links. Conventional node graphs degenerate into unreadable "hairballs" once datasets exceed a few hundred nodes.',
      architecture: 'Constructed an infinite 3D spatial canvas with temporal Z-axis stacking. Users can scrub forward and backward in time while nodes dynamically cluster using force-directed physics with GPU acceleration. Semantic lenses allow instant drill-down without losing spatial context.',
      metrics: 'Successfully scales to 100,000+ active nodes with sub-15ms fuzzy search and filtering. Propelled the company to a $14M Series A funding round and enterprise contracts with national research institutes.',
      specs: {
        fov: 'INFINITE 3D VIEWPORT',
        latency: '15MS QUERY PIPELINE',
        hardware: 'HIGH-DPI DESKTOP RIGS'
      }
    }
  };

  // --- 01. DUAL-RETICLE CUSTOM CURSOR ENGINE ---
  function initCustomCursor() {
    // Only on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    window.addEventListener('mousemove', (e) => {
      state.cursor.targetX = e.clientX;
      state.cursor.targetY = e.clientY;

      // Immediate positioning for inner precision reticle
      DOM.cursorDot.style.left = `${e.clientX}px`;
      DOM.cursorDot.style.top = `${e.clientY}px`;
      
      // Update Telemetry Readout
      if (DOM.telemetryCursor) {
        DOM.telemetryCursor.textContent = `X: ${Math.round(e.clientX)} | Y: ${Math.round(e.clientY)}`;
      }
    });

    window.addEventListener('mousedown', () => {
      DOM.body.classList.add('cursor-active');
    });

    window.addEventListener('mouseup', () => {
      DOM.body.classList.remove('cursor-active');
    });

    // Hover state detection & contextual label inspection
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, .skill-matrix-chip, .project-card-3d, .hypercube-wrapper');
      if (target) {
        DOM.body.classList.add('cursor-hover');
        const customText = target.getAttribute('data-cursor') || '[INTERACT]';
        DOM.cursorLabel.textContent = customText;
        
        // Procedural hover chirp sound
        if (window.soundFX) {
          window.soundFX.playHover();
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('[data-cursor], a, button, input, textarea, .skill-matrix-chip, .project-card-3d, .hypercube-wrapper');
      if (target) {
        DOM.body.classList.remove('cursor-hover');
      }
    });
  }

  // Fluid smooth follower update via requestAnimationFrame
  function updateCursorPhysics() {
    // Lerp outer follower ring towards cursor target
    const ease = 0.24;
    state.cursor.x += (state.cursor.targetX - state.cursor.x) * ease;
    state.cursor.y += (state.cursor.targetY - state.cursor.y) * ease;

    DOM.cursorFollower.style.left = `${state.cursor.x}px`;
    DOM.cursorFollower.style.top = `${state.cursor.y}px`;
  }

  // --- 02. SPATIAL CAMERA & PARALLAX MATH ---
  function initSpatialParallax() {
    const maxTilt = 12; // degrees

    window.addEventListener('mousemove', (e) => {
      if (state.drag.isDragging) return;

      const normX = (e.clientX / window.innerWidth) * 2 - 1;  // -1 to +1
      const normY = (e.clientY / window.innerHeight) * 2 - 1; // -1 to +1

      state.camera.targetRy = normX * maxTilt;
      state.camera.targetRx = -normY * maxTilt;
    });

    // Orbital drag anywhere on viewport
    window.addEventListener('mousedown', (e) => {
      // Don't drag if clicking buttons, inputs, chips or modal
      if (e.target.closest('button, a, input, textarea, .blueprint-modal-container, .shortcuts-dialog, .nav-node-btn, .mobile-dock-btn, .hypercube-wrapper, .lab-widget-card')) {
        return;
      }
      state.drag.isDragging = true;
      state.drag.startX = e.clientX;
      state.drag.startY = e.clientY;
      DOM.body.classList.add('cursor-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.drag.isDragging) return;
      const dx = e.clientX - state.drag.startX;
      const dy = e.clientY - state.drag.startY;
      state.drag.rotY += dx * 0.12;
      state.drag.rotX -= dy * 0.12;

      // Clamp rotX
      state.drag.rotX = Math.max(-35, Math.min(35, state.drag.rotX));

      state.drag.startX = e.clientX;
      state.drag.startY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      if (state.drag.isDragging) {
        state.drag.isDragging = false;
        DOM.body.classList.remove('cursor-dragging');
      }
    });

    // Double click to reset camera
    window.addEventListener('dblclick', (e) => {
      if (e.target.closest('button, a, input, textarea')) return;
      resetCamera();
    });

    // Brand logo reset camera
    if (DOM.brandLogo) {
      DOM.brandLogo.addEventListener('click', () => {
        resetCamera();
        navigateToSection(0);
      });
    }
  }

  function resetCamera() {
    state.drag.rotX = 0;
    state.drag.rotY = 0;
    state.camera.targetRx = 0;
    state.camera.targetRy = 0;
    if (window.soundFX) window.soundFX.playClick();
  }

  function updateCameraLoop() {
    // Smooth camera damping
    const ease = 0.1;
    state.camera.rx += (state.camera.targetRx + state.drag.rotX - state.camera.rx) * ease;
    state.camera.ry += (state.camera.targetRy + state.drag.rotY - state.camera.ry) * ease;

    // Apply 3D CSS transform to world stage
    DOM.worldStage.style.transform = `rotateX(${state.camera.rx.toFixed(2)}deg) rotateY(${state.camera.ry.toFixed(2)}deg)`;

    // Update Telemetry Readout
    if (DOM.telemetryAngles) {
      DOM.telemetryAngles.textContent = `P: ${state.camera.rx.toFixed(1)}° | Y: ${state.camera.ry.toFixed(1)}°`;
    }
  }

  // --- 03. 3D SECTION ROUTER & HYPERSPACE TRANSITIONS ---
  function navigateToSection(targetIndex) {
    if (targetIndex < 0 || targetIndex >= state.sections.length) return;
    if (targetIndex === state.activeSectionIndex && !state.isTransitioning) return;
    if (state.isTransitioning) return;

    state.isTransitioning = true;
    const prevIndex = state.activeSectionIndex;
    state.activeSectionIndex = targetIndex;

    const prevSection = document.getElementById(state.sections[prevIndex]);
    const nextSection = document.getElementById(state.sections[targetIndex]);

    // Audio Warp Sound
    if (window.soundFX) {
      window.soundFX.playWarp();
    }

    // 3D Hyperspace Warp Transition
    if (prevSection) {
      prevSection.classList.add('warping-out');
      prevSection.classList.remove('active');
    }

    if (nextSection) {
      nextSection.classList.add('warping-in');
      
      setTimeout(() => {
        if (prevSection) {
          prevSection.classList.remove('warping-out');
        }
        nextSection.classList.remove('warping-in');
        nextSection.classList.add('active');
        state.isTransitioning = false;
      }, 350);
    }

    // Update Waypoint Nav Indicators
    DOM.orbitalNavBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === targetIndex);
    });
    DOM.mobileDockBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === targetIndex);
    });

    // Update Telemetry HUD
    if (DOM.telemetrySection) {
      DOM.telemetrySection.textContent = state.sectionLabels[targetIndex];
    }
  }

  function initSectionNavigation() {
    // Orbital Nav Buttons
    DOM.orbitalNavBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        navigateToSection(index);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Mobile Dock Buttons
    DOM.mobileDockBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        navigateToSection(index);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Hero CTA Buttons
    if (DOM.heroCtaProjects) {
      DOM.heroCtaProjects.addEventListener('click', () => {
        navigateToSection(2); // Artifacts / Projects
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    if (DOM.heroCtaContact) {
      DOM.heroCtaContact.addEventListener('click', () => {
        navigateToSection(4); // Dispatch / Contact
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    // Keyboard navigation: 1-5
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is typing in form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key >= '1' && e.key <= '5') {
        const idx = parseInt(e.key, 10) - 1;
        navigateToSection(idx);
      }
    });

    // Wheel navigation (smooth throttle)
    let lastWheelTime = 0;
    window.addEventListener('wheel', (e) => {
      // Ignore if user is inside a scrollable modal
      if (e.target.closest('.modal-body-scrollable, .transmission-code-screen')) return;

      const now = performance.now();
      if (now - lastWheelTime < 700) return; // Debounce wheel
      if (Math.abs(e.deltaY) < 30) return;

      if (e.deltaY > 0) {
        // Next section
        if (state.activeSectionIndex < state.sections.length - 1) {
          lastWheelTime = now;
          navigateToSection(state.activeSectionIndex + 1);
        }
      } else {
        // Prev section
        if (state.activeSectionIndex > 0) {
          lastWheelTime = now;
          navigateToSection(state.activeSectionIndex - 1);
        }
      }
    }, { passive: true });
  }

  // --- 04. 3D INTERACTIVE HYPERCUBE (TESSERACT) ---
  function initHypercube() {
    if (!DOM.hypercubeWrapper || !DOM.hypercubeMesh) return;

    let isExploded = false;

    DOM.hypercubeWrapper.addEventListener('click', () => {
      isExploded = !isExploded;
      DOM.hypercubeMesh.classList.toggle('exploded', isExploded);
      
      if (window.soundFX) {
        window.soundFX.playClick();
      }

      // Brief animation pause for dramatic effect
      DOM.hypercubeMesh.classList.add('paused');
      setTimeout(() => {
        DOM.hypercubeMesh.classList.remove('paused');
      }, 2000);
    });

    // Tilt cube dynamically based on mouse hover position
    DOM.hypercubeWrapper.addEventListener('mousemove', (e) => {
      const rect = DOM.hypercubeWrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotX = -y * 60;
      const rotY = x * 60;

      DOM.hypercubeMesh.style.transform = `rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`;
      DOM.hypercubeMesh.classList.add('paused');
    });

    DOM.hypercubeWrapper.addEventListener('mouseleave', () => {
      DOM.hypercubeMesh.style.transform = '';
      DOM.hypercubeMesh.classList.remove('paused');
    });
  }

  // --- 05. INTERACTIVE MICRO-INTERACTION LAB (ABOUT SECTION) ---
  function initMicroInteractionLab() {
    // 1. Magnetic Elastic Spring Button
    if (DOM.springBtn) {
      let isSpringPressed = false;
      let startX = 0, startY = 0;
      let currentX = 0, currentY = 0;

      DOM.springBtn.addEventListener('mousedown', (e) => {
        isSpringPressed = true;
        startX = e.clientX;
        startY = e.clientY;
        if (window.soundFX) window.soundFX.playClick();
      });

      window.addEventListener('mousemove', (e) => {
        if (!isSpringPressed) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        // Damped elastic resistance
        currentX = dx * 0.45;
        currentY = dy * 0.45;

        DOM.springBtn.style.transform = `translate(${currentX}px, ${currentY}px) scale(0.96)`;

        const tension = Math.sqrt(currentX * currentX + currentY * currentY) / 40;
        if (DOM.springTensionVal) {
          DOM.springTensionVal.textContent = tension.toFixed(2);
        }
      });

      window.addEventListener('mouseup', () => {
        if (!isSpringPressed) return;
        isSpringPressed = false;

        // Spring snap-back with CSS transition
        DOM.springBtn.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.48)';
        DOM.springBtn.style.transform = 'translate(0px, 0px) scale(1)';

        if (window.soundFX) window.soundFX.playClick();

        setTimeout(() => {
          DOM.springBtn.style.transition = '';
          if (DOM.springTensionVal) DOM.springTensionVal.textContent = '0.00';
        }, 500);
      });
    }

    // 2. Dynamic Token Radius Slider
    if (DOM.radiusSlider) {
      DOM.radiusSlider.addEventListener('input', (e) => {
        const val = e.target.value;
        const glowVal = Math.round(val * 3);

        DOM.html.style.setProperty('--lab-border-radius', `${val}px`);
        DOM.html.style.setProperty('--lab-glow-spread', `${glowVal}px`);

        if (DOM.radiusVal) DOM.radiusVal.textContent = `${val}px`;
        if (DOM.glowVal) DOM.glowVal.textContent = `${glowVal}px`;
      });
    }

    // 3. Haptic Ripple Pad
    if (DOM.ripplePad) {
      let rippleCount = 0;
      DOM.ripplePad.addEventListener('click', (e) => {
        const rect = DOM.ripplePad.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const shockwave = document.createElement('div');
        shockwave.className = 'ripple-shockwave';
        shockwave.style.left = `${x - 40}px`;
        shockwave.style.top = `${y - 40}px`;
        shockwave.style.width = '80px';
        shockwave.style.height = '80px';

        DOM.ripplePad.appendChild(shockwave);

        rippleCount++;
        if (DOM.rippleCountVal) DOM.rippleCountVal.textContent = rippleCount;

        if (window.soundFX) window.soundFX.playHover();

        setTimeout(() => {
          shockwave.remove();
        }, 600);
      });
    }

    // 4. Multi-State Aerospace Switch
    if (DOM.switchRail && DOM.switchOptionBtns.length) {
      const stateLabels = ['SAFE', 'ARMED', 'WARP'];
      DOM.switchOptionBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
          DOM.switchOptionBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (DOM.switchPill) {
            DOM.switchPill.style.transform = `translateX(${index * 100}%)`;
          }

          if (DOM.switchStateVal) {
            DOM.switchStateVal.textContent = stateLabels[index];
            DOM.switchStateVal.style.color = index === 2 ? 'var(--shock-magenta)' : (index === 1 ? 'var(--cyber-cyan)' : 'var(--acid-lime)');
          }

          if (window.soundFX) {
            window.soundFX.playClick();
          }
        });
      });
    }
  }

  // --- 06. 3D PROJECT CARDS TILT & SPECULAR GLARE ---
  function initProjectCards() {
    DOM.projectCards.forEach((card) => {
      const glare = card.querySelector('.card-specular-glare');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = ((y - centerY) / centerY) * -9; // Max 9 deg
        const rotY = ((x - centerX) / centerX) * 11; // Max 11 deg

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(25px)`;

        // Specular glare gradient positioning
        if (glare) {
          const pctX = (x / rect.width) * 100;
          const pctY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${pctX.toFixed(1)}% ${pctY.toFixed(1)}%, rgba(255, 255, 255, 0.16) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });

    // Project Card trigger Blueprint Modal
    DOM.projectCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        const projectKey = card.getAttribute('data-project');
        openBlueprintModal(projectKey);
      });
    });

    DOM.projectTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const projectKey = trigger.getAttribute('data-project-trigger');
        openBlueprintModal(projectKey);
      });
    });
  }

  // --- 07. FULL-SCREEN 3D BLUEPRINT MODAL ---
  function openBlueprintModal(projectKey) {
    const data = PROJECT_DATA[projectKey] || PROJECT_DATA.aether;

    DOM.modalProjectId.textContent = data.id;
    DOM.modalTitle.textContent = data.title;
    DOM.modalChallengeText.textContent = data.challenge;
    DOM.modalArchText.textContent = data.architecture;
    DOM.modalMetricsText.textContent = data.metrics;

    const specFov = document.getElementById('spec-fov');
    const specLatency = document.getElementById('spec-latency');
    const specHardware = document.getElementById('spec-hardware');

    if (specFov) specFov.textContent = data.specs.fov;
    if (specLatency) specLatency.textContent = data.specs.latency;
    if (specHardware) specHardware.textContent = data.specs.hardware;

    // Reset to first tab
    setModalTab(0);

    DOM.blueprintModal.classList.add('active');
    if (window.soundFX) window.soundFX.playWarp();
  }

  function closeBlueprintModal() {
    DOM.blueprintModal.classList.remove('active');
    if (window.soundFX) window.soundFX.playClick();
  }

  function setModalTab(tabIndex) {
    DOM.modalTabBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === tabIndex);
    });
    DOM.modalTabContents.forEach((content, idx) => {
      content.classList.toggle('active', idx === tabIndex);
    });
  }

  function initBlueprintModalEvents() {
    if (DOM.modalCloseBtn) {
      DOM.modalCloseBtn.addEventListener('click', closeBlueprintModal);
    }

    DOM.blueprintModal.addEventListener('click', (e) => {
      if (e.target === DOM.blueprintModal) {
        closeBlueprintModal();
      }
    });

    DOM.modalTabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        setModalTab(index);
        if (window.soundFX) window.soundFX.playClick();
      });
    });
  }

  // --- 08. SKILLS MATRIX FILTERING & CHIP INTERACTIONS ---
  function initSkillsMatrix() {
    DOM.matrixFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');

        DOM.matrixFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        DOM.skillChips.forEach((chip) => {
          const category = chip.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            chip.classList.remove('dimmed');
          } else {
            chip.classList.add('dimmed');
          }
        });

        if (window.soundFX) window.soundFX.playHover();
      });
    });

    DOM.skillChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.style.transform = 'translateZ(35px) scale(1.04)';
        if (window.soundFX) window.soundFX.playClick();
        setTimeout(() => {
          chip.style.transform = '';
        }, 300);
      });
    });
  }

  // --- 09. CONTACT SECTION: TRANSMISSION TERMINAL ---
  function initContactTerminal() {
    // Frequency selection
    let activeFreq = '142.8 MHZ [NEW VENTURE]';
    DOM.freqBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        DOM.freqBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const freqType = btn.getAttribute('data-freq');
        if (freqType === 'VENTURE') activeFreq = '142.8 MHZ [NEW VENTURE]';
        else if (freqType === 'ADVISORY') activeFreq = '284.1 MHZ [DESIGN ADVISORY]';
        else if (freqType === 'COFFEE') activeFreq = '419.0 MHZ [CASUAL COFFEE]';

        appendTelemetryLine(`> TUNED FREQUENCY: ${activeFreq}`, 'code-line-accent');
        if (window.soundFX) window.soundFX.playHover();
      });
    });

    // Live typing telemetry monitor
    const inputs = [DOM.inputSender, DOM.inputContact, DOM.inputPayload];
    inputs.forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        const totalChars = (DOM.inputSender.value.length + DOM.inputContact.value.length + DOM.inputPayload.value.length);
        if (DOM.packetStatus) {
          DOM.packetStatus.textContent = `[BUFFER: ${totalChars} BYTES]`;
        }
      });
    });

    // Form submission simulation
    if (DOM.terminalForm) {
      DOM.terminalForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const sender = DOM.inputSender.value.trim() || 'ANONYMOUS_AGENT';
        const contact = DOM.inputContact.value.trim() || 'NO_RETURN_CARRIER';
        const payload = DOM.inputPayload.value.trim();

        if (!payload) return;

        // Visual + Audio dispatch
        if (DOM.transmitBtnText) DOM.transmitBtnText.textContent = 'TRANSMITTING VIA QUANTUM RELAY...';
        DOM.transmitBtn.disabled = true;

        if (window.soundFX) {
          window.soundFX.playTransmit();
        }

        appendTelemetryLine(`> PACKET ENCRYPTED: SHA-256`, 'code-line-cyan');
        appendTelemetryLine(`> DISPATCHING TO VEX CORE...`, 'code-line-accent');

        setTimeout(() => {
          appendTelemetryLine(`> [STATUS 200 OK] SIGNAL RECEIVED BY ALEX CHEN.`, 'code-line-accent');
          appendTelemetryLine(`> DISPATCH LOGGED IN SECURE VAULT.`, 'code-line-dim');

          if (DOM.transmitBtnText) DOM.transmitBtnText.textContent = 'TRANSMISSION CONFIRMED ✓';
          if (DOM.packetStatus) DOM.packetStatus.textContent = '[TRANSMITTED]';

          setTimeout(() => {
            DOM.terminalForm.reset();
            if (DOM.transmitBtnText) DOM.transmitBtnText.textContent = 'TRANSMIT PACKET TO ORBIT';
            DOM.transmitBtn.disabled = false;
            if (DOM.packetStatus) DOM.packetStatus.textContent = '[BUFFER_READY]';
          }, 3000);
        }, 1200);
      });
    }

    // Direct email copy
    if (DOM.emailDirectLink) {
      DOM.emailDirectLink.addEventListener('click', (e) => {
        navigator.clipboard.writeText('alex@vexprotocol.design').then(() => {
          appendTelemetryLine('> COPIED: alex@vexprotocol.design TO CLIPBOARD', 'code-line-accent');
          if (window.soundFX) window.soundFX.playClick();
        }).catch(() => {});
      });
    }

    // Terminal Clock update
    setInterval(() => {
      if (DOM.terminalClock) {
        const now = new Date();
        DOM.terminalClock.textContent = `UTC ${now.toISOString().substring(11, 19)}`;
      }
    }, 1000);
  }

  function appendTelemetryLine(text, cssClass = 'code-line-dim') {
    if (!DOM.telemetryCodeScreen) return;
    const line = document.createElement('div');
    line.className = cssClass;
    line.textContent = text;
    DOM.telemetryCodeScreen.appendChild(line);
    DOM.telemetryCodeScreen.scrollTop = DOM.telemetryCodeScreen.scrollHeight;
  }

  // --- 10. SYSTEM MODES & HUD TOGGLES ---
  function initHudControls() {
    // Audio Toggle
    if (DOM.audioBtn) {
      DOM.audioBtn.addEventListener('click', () => {
        if (!window.soundFX) return;
        const isLive = window.soundFX.toggleMute();
        DOM.audioBtn.classList.toggle('active', isLive);
        DOM.audioIcon.textContent = isLive ? '🔊' : '🔇';
        DOM.audioLabel.textContent = isLive ? 'AUDIO: LIVE' : 'AUDIO: OFF';
      });
    }

    // Dimension Switch (Void <-> Solar)
    if (DOM.dimensionBtn) {
      DOM.dimensionBtn.addEventListener('click', () => {
        state.currentTheme = state.currentTheme === 'void' ? 'solar' : 'void';
        DOM.html.setAttribute('data-theme', state.currentTheme);
        
        DOM.dimensionBtn.classList.toggle('active', state.currentTheme === 'solar');
        DOM.dimensionLabel.textContent = state.currentTheme === 'solar' ? 'SOLAR MATRIX' : 'VOID MODE';

        if (window.soundFX) {
          window.soundFX.playDimensionShift();
        }
      });
    }

    // Zero-G Toggle
    if (DOM.zeroGBtn) {
      DOM.zeroGBtn.addEventListener('click', () => {
        state.zeroGravity = !state.zeroGravity;
        DOM.body.classList.toggle('zero-gravity', state.zeroGravity);
        DOM.zeroGBtn.classList.toggle('active', state.zeroGravity);
        DOM.zeroGLabel.textContent = state.zeroGravity ? 'GRAVITY: 0.0G (ZERO-G)' : 'GRAVITY: 1.0G';

        if (window.soundFX) {
          window.soundFX.playZeroG();
        }
      });
    }

    // Shortcuts Dialog
    if (DOM.shortcutsBtn) {
      DOM.shortcutsBtn.addEventListener('click', () => {
        DOM.shortcutsDialog.classList.add('active');
        if (window.soundFX) window.soundFX.playHover();
      });
    }
    if (DOM.shortcutsCloseBtn) {
      DOM.shortcutsCloseBtn.addEventListener('click', () => {
        DOM.shortcutsDialog.classList.remove('active');
        if (window.soundFX) window.soundFX.playClick();
      });
    }
  }

  // --- 11. KEYBOARD SHORTCUTS CONTROLLER ---
  function initKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept when user is typing in form inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
        }
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'm': // Mute / Unmute audio
          if (DOM.audioBtn) DOM.audioBtn.click();
          break;
        case 'd': // Dimension shift
          if (DOM.dimensionBtn) DOM.dimensionBtn.click();
          break;
        case 'g': // Zero-G
          if (DOM.zeroGBtn) DOM.zeroGBtn.click();
          break;
        case 'r': // Reset camera
          resetCamera();
          break;
        case '?':
        case '/':
        case 'h': // Help shortcuts
          DOM.shortcutsDialog.classList.toggle('active');
          if (window.soundFX) window.soundFX.playClick();
          break;
        case 'escape': // Close open modals
          if (DOM.blueprintModal.classList.contains('active')) {
            closeBlueprintModal();
          }
          if (DOM.shortcutsDialog.classList.contains('active')) {
            DOM.shortcutsDialog.classList.remove('active');
          }
          break;
      }
    });
  }

  // --- 12. PERFORMANCE MONITOR (FPS & RAF LOOP) ---
  function renderLoop(currentTime) {
    // 1. Update cursor physics
    updateCursorPhysics();

    // 2. Update 3D camera damping
    updateCameraLoop();

    // 3. FPS ticker
    state.frameCount++;
    if (currentTime - state.lastFpsTime >= 1000) {
      state.fps = Math.round((state.frameCount * 1000) / (currentTime - state.lastFpsTime));
      state.frameCount = 0;
      state.lastFpsTime = currentTime;

      if (DOM.systemStatus) {
        DOM.systemStatus.textContent = `CORE: ONLINE // ${state.fps} FPS`;
      }
    }

    requestAnimationFrame(renderLoop);
  }

  // --- 13. TOUCH & MOBILE ORIENTATION ---
  function initTouchAndMobile() {
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const deltaX = e.changedTouches[0].clientX - touchStartX;
        const deltaY = e.changedTouches[0].clientY - touchStartY;

        // Horizontal swipe navigation (if deltaX > 60px and deltaX > deltaY)
        if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
          if (deltaX < 0 && state.activeSectionIndex < state.sections.length - 1) {
            navigateToSection(state.activeSectionIndex + 1);
          } else if (deltaX > 0 && state.activeSectionIndex > 0) {
            navigateToSection(state.activeSectionIndex - 1);
          }
        }
      }
    }, { passive: true });

    // Device orientation gyroscope tilt (if supported)
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
          // gamma: left-to-right (-90 to 90), beta: front-to-back (-180 to 180)
          const tiltX = Math.max(-20, Math.min(20, (e.beta - 45) * 0.4));
          const tiltY = Math.max(-25, Math.min(25, e.gamma * 0.5));
          state.camera.targetRx = -tiltX;
          state.camera.targetRy = tiltY;
        }
      });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    initCustomCursor();
    initSpatialParallax();
    initSectionNavigation();
    initHypercube();
    initMicroInteractionLab();
    initProjectCards();
    initBlueprintModalEvents();
    initSkillsMatrix();
    initContactTerminal();
    initHudControls();
    initKeyboardShortcuts();
    initTouchAndMobile();

    // Start main render loop
    requestAnimationFrame(renderLoop);

    console.log('%c[VEX PROTOCOL ENGINE INITIALIZED]', 'background: #07070a; color: #c4ff00; font-size: 12px; font-weight: bold; padding: 4px 8px; border: 1px solid #c4ff00;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
