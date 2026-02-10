const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

const getUsers = () => {
  try {
    const raw = localStorage.getItem('users');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

const setUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

const ensureAdminUser = () => {
  const users = getUsers();
  const exists = users.some((user) => user.id === 'admin');
  if (!exists) {
    users.push({
      id: 'admin',
      name: '관리자',
      phone: '010-0000-0000',
      email: 'admin@boxit.com',
      password: 'admin1',
      role: 'admin',
    });
    setUsers(users);
  }
};

const normalizeUsers = () => {
  let users = getUsers().map((user) => ({
    ...user,
    role: user.id === 'admin' ? 'admin' : user.role || 'user',
  }));
  const hasAdmin = users.some((user) => user.id === 'admin');
  if (!hasAdmin) {
    users.push({
      id: 'admin',
      name: '관리자',
      phone: '010-0000-0000',
      email: 'admin@boxit.com',
      password: 'admin1',
      role: 'admin',
    });
  }
  setUsers(users);

  try {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      const currentUser = JSON.parse(raw);
      currentUser.role = currentUser.id === 'admin' ? 'admin' : currentUser.role || 'user';
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
  } catch (err) {
    console.error(err);
  }
};

ensureAdminUser();
normalizeUsers();

const markStatus = (el, ok, message) => {
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('ok', !!ok);
  el.classList.toggle('bad', ok === false);
  if (ok === null) {
    el.classList.remove('ok');
    el.classList.remove('bad');
  }
};

if (signupForm) {
  const idCheckBtn = document.getElementById('idCheckBtn');
  const emailCheckBtn = document.getElementById('emailCheckBtn');
  const phone = document.getElementById('phone');
  const signupNotice = document.getElementById('signupNotice');
  const idStatus = document.getElementById('idStatus');
  const phoneStatus = document.getElementById('phoneStatus');
  const nameStatus = document.getElementById('nameStatus');
  const emailStatus = document.getElementById('emailStatus');
  const pw = document.getElementById('pw');
  const pwConfirm = document.getElementById('pwConfirm');
  const pwStatus = document.getElementById('pwStatus');
  const pwRuleStatus = document.getElementById('pwRuleStatus');

  const idInput = document.getElementById('userId');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const isValidPhone = (value) => /^010-?\d{4}-?\d{4}$/.test(value);
  const isValidId = (value) => /^[A-Za-z0-9_]{4,20}$/.test(value);
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  phone.addEventListener('input', (e) => {
    const formatted = formatPhone(e.target.value);
    if (formatted !== e.target.value) {
      e.target.value = formatted;
    }
    if (!e.target.value.trim()) {
      markStatus(phoneStatus, null, '');
    } else if (isValidPhone(e.target.value.trim())) {
      markStatus(phoneStatus, true, '휴대폰 번호가 확인되었습니다.');
    } else {
      markStatus(phoneStatus, false, '010-0000-0000 형식으로 입력해 주세요.');
    }
  });

  idCheckBtn.addEventListener('click', () => {
    const value = idInput.value.trim();
    if (!value) {
      markStatus(idStatus, false, '아이디를 입력해 주세요.');
      idStatus.dataset.checked = 'false';
      return;
    }
    if (!isValidId(value)) {
      markStatus(idStatus, false, '4~20자 영문/숫자/언더바만 가능합니다.');
      idStatus.dataset.checked = 'false';
      return;
    }
    const users = getUsers();
    const duplicated = users.some((user) => user.id.toLowerCase() === value.toLowerCase());
    if (duplicated) {
      markStatus(idStatus, false, '이미 사용 중인 아이디입니다.');
      idStatus.dataset.checked = 'false';
    } else {
      markStatus(idStatus, true, '사용 가능한 아이디입니다.');
      idStatus.dataset.checked = 'true';
    }
  });

  emailCheckBtn.addEventListener('click', () => {
    const value = emailInput.value.trim().toLowerCase();
    if (!value) {
      markStatus(emailStatus, false, '이메일을 입력해 주세요.');
      emailStatus.dataset.checked = 'false';
      return;
    }
    if (!isValidEmail(value)) {
      markStatus(emailStatus, false, '이메일 형식을 확인해 주세요.');
      emailStatus.dataset.checked = 'false';
      return;
    }
    const users = getUsers();
    const duplicated = users.some((user) => user.email.toLowerCase() === value);
    if (duplicated) {
      markStatus(emailStatus, false, '이미 등록된 이메일입니다.');
      emailStatus.dataset.checked = 'false';
    } else {
      markStatus(emailStatus, true, '사용 가능한 이메일입니다.');
      emailStatus.dataset.checked = 'true';
    }
  });

  const checkPwRule = () => {
    if (!pw.value) {
      markStatus(pwRuleStatus, null, '');
      return;
    }
    if (pw.value.length >= 8) {
      markStatus(pwRuleStatus, true, '사용 가능한 비밀번호입니다.');
    } else {
      markStatus(pwRuleStatus, false, '비밀번호는 8자 이상이어야 합니다.');
    }
  };

  const checkPwMatch = () => {
    if (!pw.value || !pwConfirm.value) {
      markStatus(pwStatus, null, '');
      return;
    }
    if (pw.value === pwConfirm.value) {
      markStatus(pwStatus, true, '비밀번호가 일치합니다.');
    } else {
      markStatus(pwStatus, false, '비밀번호가 일치하지 않습니다.');
    }
  };

  pw.addEventListener('input', () => {
    checkPwRule();
    checkPwMatch();
  });
  pwConfirm.addEventListener('input', checkPwMatch);

  nameInput.addEventListener('input', () => {
    if (!nameInput.value.trim()) {
      markStatus(nameStatus, null, '');
    } else {
      markStatus(nameStatus, true, '');
    }
  });

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const phoneValue = phone.value.trim();
    const idValue = idInput.value.trim();
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();

    if (!phoneValue || !isValidPhone(phoneValue)) {
      markStatus(phoneStatus, false, '휴대폰 번호를 확인해 주세요.');
      return;
    }
    if (!idValue || !isValidId(idValue)) {
      markStatus(idStatus, false, '아이디 형식을 확인해 주세요.');
      return;
    }
    if (!nameValue) {
      markStatus(nameStatus, false, '이름을 입력해 주세요.');
      return;
    }
    if (!emailValue || !isValidEmail(emailValue)) {
      markStatus(emailStatus, false, '이메일 형식을 확인해 주세요.');
      return;
    }
    if (!pw.value || pw.value.length < 8) {
      markStatus(pwRuleStatus, false, '비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    const idOk = idStatus.dataset.checked === 'true';
    const emailOk = emailStatus.dataset.checked === 'true';
    if (!idOk) {
      markStatus(idStatus, false, '아이디 중복체크를 진행해 주세요.');
      return;
    }
    if (!emailOk) {
      markStatus(emailStatus, false, '이메일 중복체크를 진행해 주세요.');
      return;
    }
    if (pw.value !== pwConfirm.value) {
      markStatus(pwStatus, false, '비밀번호가 일치하지 않습니다.');
      return;
    }
    const users = getUsers();
    const idDuplicate = users.some((user) => user.id.toLowerCase() === idValue.toLowerCase());
    const emailDuplicate = users.some((user) => user.email.toLowerCase() === emailValue.toLowerCase());
    if (idDuplicate) {
      markStatus(idStatus, false, '이미 사용 중인 아이디입니다.');
      idStatus.dataset.checked = 'false';
      return;
    }
    if (emailDuplicate) {
      markStatus(emailStatus, false, '이미 등록된 이메일입니다.');
      emailStatus.dataset.checked = 'false';
      return;
    }

    users.push({
      id: idValue,
      name: nameValue,
      phone: phoneValue,
      email: emailValue,
      password: pw.value,
      role: idValue === 'admin' ? 'admin' : 'user',
    });
    setUsers(users);

    sessionStorage.setItem('lastSignupId', idValue);
    if (signupNotice) {
      signupNotice.textContent = '회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.';
      signupNotice.classList.remove('error');
      signupNotice.classList.add('success');
      signupNotice.style.display = 'block';
    }
    signupForm.reset();
    markStatus(idStatus, null, '');
    markStatus(emailStatus, null, '');
    markStatus(pwStatus, null, '');
    markStatus(pwRuleStatus, null, '');
    markStatus(phoneStatus, null, '');
    markStatus(nameStatus, null, '');
    idStatus.dataset.checked = 'false';
    emailStatus.dataset.checked = 'false';

    sessionStorage.setItem('signupSuccess', '1');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  });
}

if (loginForm) {
  const loginStatus = document.getElementById('loginStatus');
  const loginNotice = document.getElementById('loginNotice');
  const signupSuccess = document.getElementById('signupSuccess');
  const loginIdInput = document.getElementById('userId');
  const loginPwInput = document.getElementById('pw');
  const users = getUsers();
  if (!users.length && loginNotice) {
    loginNotice.textContent = '회원가입 먼저 해주세요.';
  }
  const params = new URLSearchParams(window.location.search);
  const fromSignup = params.get('signup') === '1' || sessionStorage.getItem('signupSuccess') === '1';
  if (signupSuccess && fromSignup) {
    signupSuccess.textContent = '회원가입이 완료되었습니다. 로그인해 주세요.';
    signupSuccess.style.display = 'block';
    sessionStorage.removeItem('signupSuccess');
  }

  const lastSignupId = sessionStorage.getItem('lastSignupId');
  if (lastSignupId && loginIdInput) {
    loginIdInput.value = lastSignupId;
    if (loginPwInput) {
      loginPwInput.focus();
    }
    sessionStorage.removeItem('lastSignupId');
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('userId').value.trim();
    const pw = document.getElementById('pw').value.trim();

    const list = getUsers();
    const matched = list.find((user) => user.id === id && user.password === pw);
    if (matched) {
      const normalized = {
        ...matched,
        role: matched.id === 'admin' ? 'admin' : matched.role || 'user',
      };
      localStorage.setItem('currentUser', JSON.stringify(normalized));
      markStatus(loginStatus, true, '로그인 성공! 메인으로 이동합니다.');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 500);
      return;
    }
    markStatus(loginStatus, false, '아이디 또는 비밀번호가 일치하지 않습니다.');
  });
}

const mypageView = document.getElementById('mypageView');
if (mypageView) {
  const notice = document.getElementById('mypageNotice');
  const info = document.getElementById('mypageInfo');
  const logoutBtn = document.getElementById('mypageLogout');
  let currentUser = null;

  try {
    const raw = localStorage.getItem('currentUser');
    currentUser = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error(err);
  }

  if (!currentUser) {
    if (notice) {
      notice.textContent = '로그인이 필요합니다. 로그인 화면으로 이동합니다.';
      notice.style.display = 'block';
    }
    if (info) info.style.display = 'none';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  } else {
    const mpUserId = document.getElementById('mpUserId');
    const mpName = document.getElementById('mpName');
    const mpEmail = document.getElementById('mpEmail');
    const mpPhone = document.getElementById('mpPhone');
    if (mpUserId) mpUserId.textContent = currentUser.id || '';
    if (mpName) mpName.textContent = currentUser.name || '';
    if (mpEmail) mpEmail.textContent = currentUser.email || '';
    if (mpPhone) mpPhone.textContent = currentUser.phone || '';
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'index.html';
    });
  }
}

const categoryHamburger = document.getElementById('categoryHamburger');
const categoryLinks = document.getElementById('categoryLinks');
const boxDropdown = document.querySelector('.dropdown');
const boxToggle = document.querySelector('.dropdown-toggle');

if (categoryHamburger && categoryLinks) {
  categoryHamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    categoryLinks.classList.toggle('open');
  });
}

if (boxToggle && boxDropdown) {
  boxToggle.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    e.preventDefault();
    boxDropdown.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  if (boxDropdown && !boxDropdown.contains(e.target)) {
    boxDropdown.classList.remove('open');
  }
});

const heroTitleEl = document.getElementById('heroTitle');
const heroSubtitleEl = document.getElementById('heroSubtitle');
const productGrid = document.getElementById('productGrid');

const defaultProducts = [
  {
    id: 'BX-001',
    name: '스탠다드 택배 박스',
    tag: '인기',
    sizeText: '320 x 240 x 180 mm',
    price: '6,900원',
    badgeText: 'BEST',
  },
  {
    id: 'BX-002',
    name: '강화 골판지 박스',
    tag: '추천',
    sizeText: '420 x 300 x 260 mm',
    price: '9,800원',
    badgeText: 'NEW',
  },
  {
    id: 'BX-003',
    name: '프리미엄 컬러 박스',
    tag: '프리미엄',
    sizeText: '360 x 260 x 220 mm',
    price: '12,000원',
    badgeText: 'HOT',
  },
];

const getSiteSettings = () => {
  try {
    const raw = localStorage.getItem('siteSettings');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const setSiteSettings = (settings) => {
  localStorage.setItem('siteSettings', JSON.stringify(settings));
};

const updateSiteSettings = (partial) => {
  const current = getSiteSettings() || {};
  const next = { ...current, ...partial };
  setSiteSettings(next);
  return next;
};

const getProducts = () => {
  try {
    const raw = localStorage.getItem('products');
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error(err);
    return [];
  }
};

const setProducts = (products) => {
  localStorage.setItem('products', JSON.stringify(products));
};

const ensureProducts = () => {
  const products = getProducts();
  if (!products.length) {
    setProducts(defaultProducts);
    return defaultProducts;
  }
  return products;
};

if (heroTitleEl && heroSubtitleEl) {
  const settings = getSiteSettings();
  if (settings) {
    heroTitleEl.textContent = settings.heroTitle || heroTitleEl.textContent;
    heroSubtitleEl.textContent = settings.heroSubtitle || heroSubtitleEl.textContent;
  }
}

const bannerSection = document.getElementById('bannerSection');
const bannerImage = document.getElementById('bannerImage');
if (bannerSection && bannerImage) {
  const settings = getSiteSettings();
  if (settings && settings.bannerImageUrl) {
    bannerImage.src = settings.bannerImageUrl;
    bannerSection.style.display = 'block';
  } else {
    bannerSection.style.display = 'none';
  }
}

const siteLogoImage = document.getElementById('siteLogoImg');
const siteLogoText = document.getElementById('siteLogoText');
if (siteLogoImage && siteLogoText) {
  const settings = getSiteSettings();
  if (settings && settings.logoImageUrl) {
    siteLogoImage.src = settings.logoImageUrl;
    siteLogoImage.style.display = 'block';
    siteLogoText.style.display = 'none';
  } else {
    siteLogoImage.style.display = 'none';
    siteLogoText.style.display = 'block';
  }
}

if (productGrid) {
  const products = ensureProducts();
  productGrid.innerHTML = products
    .map((product) => {
      const badge = product.badgeText ? `<div class="tag">${product.badgeText}</div>` : '';
      const tag = product.tag ? `<span class="tag">${product.tag}</span>` : '';
      const size = product.sizeText ? `<p class="muted">${product.sizeText}</p>` : '';
      return `\n      <div class="card">\n        ${badge}\n        <h3>${product.name}</h3>\n        ${tag}\n        ${size}\n        <div class="price">${product.price}</div>\n      </div>\n    `;
    })
    .join('');
}

const adminPanel = document.getElementById('adminPanel');
if (adminPanel) {
  let currentUser = null;
  try {
    const raw = localStorage.getItem('currentUser');
    currentUser = raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error(err);
  }

  if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = 'login.html';
  } else {
    const adminNotice = document.getElementById('adminNotice');
    const adminError = document.getElementById('adminError');
    const heroTitleInput = document.getElementById('heroTitleInput');
    const heroSubtitleInput = document.getElementById('heroSubtitleInput');
    const saveHero = document.getElementById('saveHero');
    const logoUrlInput = document.getElementById('logoUrlInput');
    const saveLogo = document.getElementById('saveLogo');
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewImage = document.getElementById('logoPreviewImage');
    const bannerUrlInput = document.getElementById('bannerUrlInput');
    const saveBanner = document.getElementById('saveBanner');
    const bannerPreview = document.getElementById('bannerPreview');
    const bannerPreviewImage = document.getElementById('bannerPreviewImage');
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const productReset = document.getElementById('productReset');

    const showNotice = (message, isError = false) => {
      if (isError) {
        if (adminError) {
          adminError.textContent = message;
          adminError.style.display = 'block';
        }
        if (adminNotice) adminNotice.style.display = 'none';
      } else {
        if (adminNotice) {
          adminNotice.textContent = message;
          adminNotice.style.display = 'block';
        }
        if (adminError) adminError.style.display = 'none';
      }
    };

    const settings = getSiteSettings();
    if (heroTitleInput) heroTitleInput.value = settings?.heroTitle || '';
    if (heroSubtitleInput) heroSubtitleInput.value = settings?.heroSubtitle || '';
    if (logoUrlInput) logoUrlInput.value = settings?.logoImageUrl || '';
    if (logoPreviewImage && settings?.logoImageUrl) {
      logoPreviewImage.src = settings.logoImageUrl;
      if (logoPreview) logoPreview.style.display = 'flex';
    }
    if (bannerUrlInput) bannerUrlInput.value = settings?.bannerImageUrl || '';
    if (bannerPreviewImage && settings?.bannerImageUrl) {
      bannerPreviewImage.src = settings.bannerImageUrl;
      if (bannerPreview) bannerPreview.style.display = 'block';
    }

    if (saveHero) {
      saveHero.addEventListener('click', () => {
        const heroTitle = heroTitleInput.value.trim();
        const heroSubtitle = heroSubtitleInput.value.trim();
        if (!heroTitle || !heroSubtitle) {
          showNotice('제목과 설명을 모두 입력해 주세요.', true);
          return;
        }
        updateSiteSettings({ heroTitle, heroSubtitle });
        showNotice('메인 문구가 저장되었습니다.');
      });
    }

    if (saveLogo) {
      saveLogo.addEventListener('click', () => {
        const logoUrl = logoUrlInput.value.trim();
        if (!logoUrl) {
          showNotice('로고 이미지 URL을 입력해 주세요.', true);
          return;
        }
        updateSiteSettings({ logoImageUrl: logoUrl });
        if (logoPreviewImage) {
          logoPreviewImage.src = logoUrl;
        }
        if (logoPreview) {
          logoPreview.style.display = 'flex';
        }
        showNotice('메인 로고가 저장되었습니다.');
      });
    }

    if (saveBanner) {
      saveBanner.addEventListener('click', () => {
        const bannerUrl = bannerUrlInput.value.trim();
        if (!bannerUrl) {
          showNotice('배너 이미지 URL을 입력해 주세요.', true);
          return;
        }
        updateSiteSettings({ bannerImageUrl: bannerUrl });
        if (bannerPreviewImage) {
          bannerPreviewImage.src = bannerUrl;
        }
        if (bannerPreview) {
          bannerPreview.style.display = 'block';
        }
        showNotice('메인 배너가 저장되었습니다.');
      });
    }

    let editingId = null;
    const renderProducts = () => {
      const products = ensureProducts();
      if (!productList) return;
      productList.innerHTML = products
        .map(
          (product) => `\n        <div class="admin-item" data-id="${product.id}">\n          <strong>${product.name}</strong>\n          <div class="meta">\n            <span>ID: ${product.id}</span>\n            <span>태그: ${product.tag || '-'}</span>\n            <span>사이즈: ${product.sizeText || '-'}</span>\n            <span>가격: ${product.price}</span>\n            <span>배지: ${product.badgeText || '-'}</span>\n          </div>\n          <div class="actions">\n            <button class="btn" type="button" data-action="edit">수정</button>\n            <button class="btn" type="button" data-action="delete">삭제</button>\n          </div>\n        </div>\n      `
        )
        .join('');
    };

    const resetProductForm = () => {
      if (!productForm) return;
      productForm.reset();
      editingId = null;
      const saveBtn = document.getElementById('productSave');
      if (saveBtn) saveBtn.textContent = '상품 저장';
    };

    if (productReset) {
      productReset.addEventListener('click', resetProductForm);
    }

    if (productForm) {
      productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('productId').value.trim();
        const name = document.getElementById('productName').value.trim();
        const tag = document.getElementById('productTag').value.trim();
        const sizeText = document.getElementById('productSize').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const badgeText = document.getElementById('productBadge').value.trim();

        if (!id || !name || !price) {
          showNotice('상품 ID, 상품명, 가격은 필수입니다.', true);
          return;
        }

        const products = ensureProducts();
        const exists = products.some((product) => product.id === id);
        if (!editingId && exists) {
          showNotice('이미 존재하는 상품 ID입니다.', true);
          return;
        }

        const payload = { id, name, tag, sizeText, price, badgeText };
        let updated;
        if (editingId) {
          updated = products.map((product) => (product.id === editingId ? payload : product));
        } else {
          updated = [...products, payload];
        }

        setProducts(updated);
        showNotice('상품이 저장되었습니다.');
        renderProducts();
        resetProductForm();
      });
    }

    if (productList) {
      productList.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        const item = e.target.closest('.admin-item');
        if (!item) return;
        const id = item.dataset.id;
        const products = ensureProducts();
        const selected = products.find((product) => product.id === id);
        if (!selected) return;

        if (button.dataset.action === 'edit') {
          document.getElementById('productId').value = selected.id;
          document.getElementById('productName').value = selected.name;
          document.getElementById('productTag').value = selected.tag || '';
          document.getElementById('productSize').value = selected.sizeText || '';
          document.getElementById('productPrice').value = selected.price || '';
          document.getElementById('productBadge').value = selected.badgeText || '';
          editingId = selected.id;
          const saveBtn = document.getElementById('productSave');
          if (saveBtn) saveBtn.textContent = '수정 저장';
        }

        if (button.dataset.action === 'delete') {
          const updated = products.filter((product) => product.id !== id);
          setProducts(updated);
          showNotice('상품이 삭제되었습니다.');
          renderProducts();
          if (editingId === id) {
            resetProductForm();
          }
        }
      });
    }

    renderProducts();
  }
}
