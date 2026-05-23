/**
 * ==========================================================================
 * APP.JS - LÓGICA E INTERAÇÕES INTERATIVAS DA ICCLA
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initCountdown();
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
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Executa uma vez no início caso o usuário recarregue a página já rolada
  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

/**
 * 2. MENU MOBILE RESPONSIVO (DRAWER)
 * Controla a abertura, fechamento e transformação tridimensional do botão hambúrguer.
 */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    mobileMenuBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  };

  mobileMenuBtn.addEventListener('click', toggleMenu);

  // Fecha o menu móvel ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });
}

/**
 * 3. CRONÔMETRO REGRESSIVO INTELIGENTE PARA O PRÓXIMO CULTO
 * Calcula de forma dinâmica quanto tempo falta para o próximo Domingo às 18:00h.
 * A lógica é autossustentável e sempre apontará para o domingo mais próximo do futuro.
 */
function initCountdown() {
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (!daysEl) return;

  const updateTimer = () => {
    const now = new Date();
    const target = new Date();
    
    // Configura o alvo para o próximo domingo (dia 0 da semana em JS)
    const currentDay = now.getDay();
    const daysUntilSunday = (7 - currentDay) % 7;
    
    target.setDate(now.getDate() + daysUntilSunday);
    target.setHours(18, 0, 0, 0); // Culto de Celebração às 18:00h

    // Se já passou das 18h de domingo, o próximo culto é no domingo que vem
    if (now.getTime() >= target.getTime()) {
      target.setDate(target.getDate() + 7);
    }

    const difference = target.getTime() - now.getTime();

    // Cálculos de tempo
    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    // Atualiza a tela com formato de dois dígitos
    daysEl.textContent = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minutesEl.textContent = String(m).padStart(2, '0');
    secondsEl.textContent = String(s).padStart(2, '0');
  };

  // Inicializa o contador e atualiza a cada segundo
  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 4. COPIAR CHAVE PIX COM FEEDBACK VISUAL PREMIUM
 * Copia a chave PIX para a área de transferência do usuário e dispara um toast.
 */
function initCopyPix() {
  const btnCopy = document.getElementById('btn-copy');
  const pixKeyText = document.getElementById('pix-key');
  const copyIcon = document.getElementById('copy-icon');

  if (!btnCopy || !pixKeyText) return;

  btnCopy.addEventListener('click', () => {
    const textToCopy = pixKeyText.textContent.trim();
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      // Muda o ícone temporariamente para check
      copyIcon.className = 'fa-regular fa-circle-check';
      copyIcon.style.color = '#d4af37';
      btnCopy.style.background = '#646f74';

      // Dispara o toast premium na tela
      showToast('Chave PIX copiada com sucesso! ✓');

      // Reseta o estado original do botão após 2.5 segundos
      setTimeout(() => {
        copyIcon.className = 'fa-regular fa-copy';
        copyIcon.style.color = '';
        btnCopy.style.background = '';
      }, 2500);
    }).catch(err => {
      console.error('Erro ao copiar texto: ', err);
      showToast('Não foi possível copiar automaticamente. Selecione e copie manualmente.');
    });
  });
}

/**
 * 5. ANIMAÇÕES DE REVELAÇÃO GRADUAL NO SCROLL (SCROLL REVEAL)
 * Utiliza o Intersection Observer nativo do navegador para ativar as animações
 * CSS nas seções do site de maneira extremamente fluida.
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null, // Usa a viewport do navegador
    threshold: 0.1, // Dispara quando 10% do elemento está visível
    rootMargin: '0px 0px -50px 0px' // Margem na parte inferior para adiar levemente a animação
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Uma vez animado, não precisa observar mais o mesmo elemento
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => {
    revealObserver.observe(el);
  });
}

/**
 * 6. FORMULÁRIO DE CONTATO (SIMULAÇÃO E FEEDBACK)
 * Intercepta o envio do formulário de contato e dá um feedback visual interativo ao usuário.
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simula uma requisição HTTP bem sucedida
    showToast(`Obrigado, ${name.split(' ')[0]}! Sua mensagem foi enviada com sucesso. ✓`);
    
    // Reseta o formulário
    form.reset();
  });
}

/**
 * 7. ANO CORRENTE NO RODAPÉ
 * Mantém o copyright do rodapé sempre atualizado automaticamente.
 */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/**
 * SISTEMA GLOBAL DE TOAST (NOTIFICAÇÕES FLUTUANTES)
 * Exibe balões de notificação elegantes com animações de fade-in e fade-out.
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.add('show');

  // Remove a notificação após 3.5 segundos
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
