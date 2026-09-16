const campaignConfig = window.CAMPAIGN_CONFIG || {};

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    if (reducedMotion) return;
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    observer.observe(element);
  });
})();

function showMessage(form, message, isError = false) {
  const messageBox = form.querySelector('.success');
  messageBox.textContent = message;
  messageBox.classList.toggle('error', isError);
  messageBox.style.display = 'block';
  messageBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function pixField(id, value) {
  const content = String(value);
  return `${id}${String(content.length).padStart(2, '0')}${content}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let index = 0; index < payload.length; index += 1) {
    crc ^= payload.charCodeAt(index) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function removeAccents(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function createPixPayload(amount) {
  const pixKey = String(campaignConfig.pixKey || '').replace(/\D/g, '');
  const name = removeAccents(campaignConfig.pixReceiverName || 'CAMPANHA')
    .toUpperCase()
    .slice(0, 25);
  const city = removeAccents(campaignConfig.pixCity || 'SAO LUIS')
    .toUpperCase()
    .slice(0, 15);
  const transactionId = String(campaignConfig.pixTransactionId || '***').slice(0, 25);
  const merchantAccount = pixField('00', 'br.gov.bcb.pix') + pixField('01', pixKey);
  const additionalData = pixField('05', transactionId);
  const basePayload = [
    pixField('00', '01'),
    pixField('26', merchantAccount),
    pixField('52', '0000'),
    pixField('53', '986'),
    pixField('54', Number(amount).toFixed(2)),
    pixField('58', 'BR'),
    pixField('59', name),
    pixField('60', city),
    pixField('62', additionalData),
    '6304',
  ].join('');

  return `${basePayload}${crc16(basePayload)}`;
}

function setupPixDonation() {
  const pixCard = document.querySelector('.pix-card');
  if (!pixCard || !campaignConfig.pixKey) return;

  const qrContainer = pixCard.querySelector('#pix-qr');
  const customValue = document.querySelector('#pix-custom-value');
  const activeAmountButton = document.querySelector('[data-pix-amount].active');
  let selectedAmount = Number(activeAmountButton?.dataset.pixAmount) || 20;
  let pixPayload = '';

  function updatePix(amount) {
    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    selectedAmount = parsedAmount;
    pixPayload = createPixPayload(selectedAmount);
    qrContainer.replaceChildren();

    if (window.QRCode) {
      new window.QRCode(qrContainer, {
        text: pixPayload,
        width: 190,
        height: 190,
        colorDark: '#08301a',
        colorLight: '#ffffff',
        correctLevel: window.QRCode.CorrectLevel.M,
      });
    } else {
      qrContainer.textContent = 'QR Code indisponível. Use o botão para copiar o código Pix.';
    }
  }

  document.querySelectorAll('[data-pix-amount]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-pix-amount]').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      customValue.value = '';
      updatePix(button.dataset.pixAmount);
    });
  });

  customValue.addEventListener('change', () => {
    if (!customValue.value) return;
    document.querySelectorAll('[data-pix-amount]').forEach((item) => item.classList.remove('active'));
    updatePix(customValue.value.replace(/\./g, '').replace(',', '.'));
  });

  pixCard.querySelector('[data-copy-pix]').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      showMessage(pixCard, `Código Pix de R$ ${selectedAmount.toFixed(2).replace('.', ',')} copiado! Abra o app do seu banco e cole para pagar.`);
    } catch (error) {
      showMessage(pixCard, 'Não foi possível copiar automaticamente. Leia o QR Code pelo app do seu banco.', true);
    }
  });

  const copyKeyButton = pixCard.querySelector('[data-copy-pix-key]');
  if (copyKeyButton) {
    copyKeyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(campaignConfig.pixKey);
        showMessage(pixCard, 'Chave Pix copiada! No aplicativo do banco, escolha pagar por chave e informe o valor desejado.');
      } catch (error) {
        showMessage(pixCard, `Use esta chave Pix: ${campaignConfig.pixKey}`, true);
      }
    });
  }

  updatePix(selectedAmount);
}

setupPixDonation();

function setupProposalSelector() {
  const proposals = document.querySelector('.proposals');
  if (!proposals) return;

  const links = [...proposals.querySelectorAll('.proposal-index a[href^="#proposta-"]')];
  const panels = [...proposals.querySelectorAll('.proposal[id^="proposta-"]')];
  if (!links.length || !panels.length) return;

  function activate(id) {
    const panel = panels.find((item) => item.id === id) || panels[0];
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${panel.id}`;
      link.classList.toggle('active', isActive);
      if (isActive) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  const selectedId = links.some((link) => link.getAttribute('href') === window.location.hash)
    ? window.location.hash.slice(1)
    : panels[0].id;
  activate(selectedId);

  links.forEach((link) => {
    link.addEventListener('click', () => {
      const id = link.getAttribute('href').slice(1);
      activate(id);
    });
  });

  let frame;
  function updateActiveProposal() {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const viewportCenter = window.innerHeight / 2;
      const current = panels.reduce((closest, panel) => {
        const bounds = panel.getBoundingClientRect();
        const distance = Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter);
        return distance < closest.distance ? { panel, distance } : closest;
      }, { panel: panels[0], distance: Infinity });
      activate(current.panel.id);
    });
  }

  window.addEventListener('scroll', updateActiveProposal, { passive: true });
  window.addEventListener('resize', updateActiveProposal);
  window.addEventListener('hashchange', () => {
    const id = window.location.hash.slice(1);
    if (panels.some((panel) => panel.id === id)) activate(id);
  });
  updateActiveProposal();
}

setupProposalSelector();

document.querySelectorAll('[data-whatsapp-channel]').forEach((button) => {
  button.addEventListener('click', () => {
    if (!campaignConfig.whatsappChannelUrl) {
      const card = button.closest('.form');
      showMessage(card, 'O link do canal ainda não foi configurado. Veja o arquivo CONFIGURAR.md.', true);
      return;
    }

    window.location.assign(campaignConfig.whatsappChannelUrl);
  });
});
