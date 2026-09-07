/**
 * ==========================================================================
 * APP.JS - LÓGICA E INTERAÇÕES INTERATIVAS DA ICCLA
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initCountdown();
  initPixTabs();
  initCopyPix();
  initScrollReveal();
  initContactForm();
  initCurrentYear();
});

/**
 * 1. COMPORTAMENTO DO CABEÇALHO AO ROLAR A PÁGINA (SCROLL)
 * Adiciona uma classe ao header para habilitar o visual glassmorphism e
 * trocar a logo branca pela preta automaticamente.
 */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. MENU MOBILE RESPONSIVO (DRAWER)
 * Controla a abertura, fechamento e transformação do botão hambúrguer.
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileMenuBtn || !navMenu) return;

  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/**
 * 3. CRONÔMETRO INTELIGENTE MULTI-EVENTOS E CULTOS
 * Calcula de forma dinâmica e sequencial o tempo restante para o próximo
 * culto semanal (quarta, quinta ou domingo) OU evento especial agendado.
 * Quando o culto da vez começa ou passa, o contador passa a contar para o próximo!
 */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const tagEl = document.getElementById('countdown-tag');
  const titleEl = document.getElementById('countdown-title');
  const descEl = document.getElementById('countdown-desc');

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Grade semanal de cultos regulares da ICCLA
  const weeklyServices = [
    {
      name: "Quarta da Vitória",
      tag: "Culto Semanal • Sapucaí",
      dayOfWeek: 3, // Quarta-feira
      hour: 19,
      minute: 0,
      location: "ICCLA Sapucaí",
      desc: "Quarta-feira às 19:00h na Unidade Sapucaí. Noite de oração, quebra de correntes e ministração da Palavra."
    },
    {
      name: "Quinta da Vitória",
      tag: "Culto Semanal • Sede Jupiara",
      dayOfWeek: 4, // Quinta-feira
      hour: 19,
      minute: 0,
      location: "Sede Jupiara",
      desc: "Quinta-feira às 19:00h na Sede Jupiara. Momento de clamor pelas famílias, oração e renovo espiritual."
    },
    {
      name: "Escola Bíblica Dominical (EBD)",
      tag: "Estudo Bíblico • Sapucaí",
      dayOfWeek: 0, // Domingo
      hour: 8,
      minute: 15,
      location: "ICCLA Sapucaí",
      desc: "Domingo às 08:15h na Unidade Sapucaí. Estudo bíblico enriquecedor para toda a família."
    },
    {
      name: "Culto de Celebração",
      tag: "Celebração • Sapucaí",
      dayOfWeek: 0, // Domingo
      hour: 18,
      minute: 0,
      location: "ICCLA Sapucaí",
      desc: "Domingo às 18:00h na Unidade Sapucaí. Grande culto de louvor, adoração congregacional e Palavra."
    },
    {
      name: "Culto de Celebração Sede",
      tag: "Celebração • Sede Jupiara",
      dayOfWeek: 0, // Domingo
      hour: 19,
      minute: 0,
      location: "Sede Jupiara",
      desc: "Domingo às 19:00h na Sede Jupiara. Celebração dominical principal em comunhão na nossa Sede."
    }
  ];

  // Eventos especiais programados da ICCLA
  const specialEvents = [
    {
      name: "Batismo & Confraternização",
      tag: "Evento Especial • Batismo",
      // 20 de Setembro de 2026 às 08:00h (Mês 8 = Setembro no JS Date)
      date: new Date(2026, 8, 20, 8, 0, 0),
      location: "Sítio Fazendinha",
      desc: "Domingo, 20/09 às 08:00h no Sítio Fazendinha. Celebração do batismo nas águas e dia de lazer em família."
    },
    {
      name: "Congresso dos Homens",
      tag: "Congresso • Homens",
      // 25 de Setembro de 2026 às 19:00h
      date: new Date(2026, 8, 25, 19, 0, 0),
      location: "ICCLA Sapucaí",
      desc: "De 25 a 28/09 às 19:00h na ICCLA Sapucaí. Noites poderosas de alinhamento e renovo espiritual."
    }
  ];

  // Identifica a próxima reunião ou evento mais próximo no tempo
  function getNextOccurrence() {
    const now = new Date();
    const candidates = [];

    // 1. Cultos semanais recorrentes
    weeklyServices.forEach(srv => {
      const nextDate = new Date(now);
      const currentDay = now.getDay();
      let daysAhead = (srv.dayOfWeek - currentDay + 7) % 7;

      nextDate.setDate(now.getDate() + daysAhead);
      nextDate.setHours(srv.hour, srv.minute, 0, 0);

      // Se a reunião já começou ou passou hoje, pula para a próxima semana
      if (nextDate.getTime() <= now.getTime()) {
        nextDate.setDate(nextDate.getDate() + 7);
      }

      candidates.push({
        title: srv.name,
        tag: srv.tag,
        desc: srv.desc,
        time: nextDate.getTime()
      });
    });

    // 2. Eventos especiais futuros
    specialEvents.forEach(evt => {
      if (evt.date.getTime() > now.getTime()) {
        candidates.push({
          title: evt.name,
          tag: evt.tag,
          desc: evt.desc,
          time: evt.date.getTime()
        });
      }
    });

    // Ordena pelo evento mais próximo
    candidates.sort((a, b) => a.time - b.time);
    return candidates[0];
  }

  let currentTarget = null;

  const updateTimer = () => {
    const now = new Date();
    const nextEvent = getNextOccurrence();

    if (!nextEvent) return;

    // Atualiza os textos da interface caso o alvo tenha mudado
    if (!currentTarget || currentTarget.title !== nextEvent.title || currentTarget.time !== nextEvent.time) {
      currentTarget = nextEvent;
      if (tagEl) tagEl.innerHTML = `<span></span> ${nextEvent.tag}`;
      if (titleEl) titleEl.textContent = `Próximo: ${nextEvent.title}`;
      if (descEl) descEl.textContent = nextEvent.desc;
    }

    const difference = nextEvent.time - now.getTime();

    if (difference <= 0) {
      // Força a recalcular no próximo tick
      currentTarget = null;
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  };

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 4. SELETOR DE ABAS DO PIX (SEDE JUPIARA & ICCLA SAPUCAÍ)
 */
function initPixTabs() {
  const tabBtns = document.querySelectorAll('.pix-tab-btn');
  const panes = {
    jupiara: document.getElementById('pane-jupiara'),
    sapucai: document.getElementById('pane-sapucai')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-pix-target');
      if (!target || !panes[target]) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      Object.values(panes).forEach(pane => {
        if (pane) pane.classList.remove('active');
      });

      panes[target].classList.add('active');
    });
  });
}

/**
 * 5. COPIAR CHAVE PIX COM FEEDBACK VISUAL PREMIUM
 */
function initCopyPix() {
  const copyButtons = document.querySelectorAll('[data-copy-id]');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-id');
      const targetEl = document.getElementById(targetId);

      if (!targetEl) return;

      const textToCopy = targetEl.textContent.trim();
      const icon = btn.querySelector('i');

      navigator.clipboard.writeText(textToCopy).then(() => {
        if (icon) icon.className = 'fa-regular fa-circle-check';
        btn.style.background = '#646f74';

        showToast('Chave PIX copiada com sucesso! ✓');

        setTimeout(() => {
          if (icon) icon.className = 'fa-regular fa-copy';
          btn.style.background = '';
        }, 2500);
      }).catch(err => {
        console.error('Erro ao copiar: ', err);
        showToast('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
      });
    });
  });
}

/**
 * 6. ANIMAÇÕES DE REVELAÇÃO GRADUAL NO SCROLL (SCROLL REVEAL)
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * 7. FORMULÁRIO DE CONTATO (GERENCIADO NATIVAMENTE VIA FORMSPREE)
 */
function initContactForm() {
  return;
}

/**
 * 8. ANO CORRENTE NO RODAPÉ
 */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * SISTEMA GLOBAL DE TOAST (NOTIFICAÇÕES FLUTUANTES)
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
