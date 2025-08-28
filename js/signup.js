/* 회원가입 스크립트 (검증, 토글, 자동 하이픈, 주소 검색, 로컬 저장) */
(function () {
  const form = document.getElementById('signupForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');
  const nameEl = document.getElementById('name');
  const nickname = document.getElementById('nickname');
  const phone = document.getElementById('phone');
  const agreeAll = document.getElementById('agreeAll');
  const agreeRequired = document.querySelectorAll('.agree.required');
  const agreeAllBoxes = document.querySelectorAll('.agree');
  const formError = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  const pwStrength = document.getElementById('pwStrength');
  const pwStrengthText = document.getElementById('pwStrengthText');
  const pwMatchMsg = document.getElementById('pwMatchMsg');

  // 비밀번호 보기/숨기기
  document.querySelectorAll('.toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.textContent = isPassword ? '숨기기' : '보기';
      btn.setAttribute('aria-label', isPassword ? '비밀번호 숨기기' : '비밀번호 보기');
      input.focus();
    });
  });

  // 핸드폰 번호 자동 하이픈
  phone.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    let formatted = digits;

    if (digits.startsWith('02')) { // 서울지역번호
      if (digits.length > 2 && digits.length <= 5) formatted = digits.replace(/(\d{2})(\d{1,3})/, '$1-$2');
      else if (digits.length > 5 && digits.length <= 9) formatted = digits.replace(/(\d{2})(\d{3,4})(\d{1,4})/, '$1-$2-$3');
      else if (digits.length > 9) formatted = digits.replace(/(\d{2})(\d{4})(\d{4}).*/, '$1-$2-$3');
    } else { // 010/011/070 등
      if (digits.length > 3 && digits.length <= 7) formatted = digits.replace(/(\d{3})(\d{1,4})/, '$1-$2');
      else if (digits.length > 7) formatted = digits.replace(/(\d{3})(\d{3,4})(\d{1,4}).*/, '$1-$2-$3');
    }
    e.target.value = formatted;
    validate(); // 포맷 후 즉시 검증
  });

  // 카카오 우편번호
  const zonecode = document.getElementById('zonecode');
  const roadAddress = document.getElementById('roadAddress');
  const detailAddress = document.getElementById('detailAddress');
  document.getElementById('postcodeBtn')?.addEventListener('click', () => {
    if (typeof daum === 'undefined' || typeof daum.Postcode === 'undefined') {
      alert('우편번호 서비스를 불러올 수 없습니다. 인터넷 연결을 확인하세요.');
      return;
    }
    new daum.Postcode({
      oncomplete: function (data) {
        zonecode.value = data.zonecode || '';
        roadAddress.value = data.roadAddress || data.address || '';
        detailAddress.focus();
      }
    }).open();
  });

  // 닉네임 간단 AI 제안 (클라이언트 조합)
  const nickBtn = document.getElementById('nickSuggestBtn');
  const nickList = document.getElementById('nickSuggestions');
  const adjectives = ['빠른', '푸른', '은하', '작은', '든든한', '즐거운', '기민한', '선명한', '깨끗한', '눈부신', '날쌘', '부드러운'];
  const animals = ['고래', '치타', '고양이', '판다', '수달', '여우', '매', '사자', '돌고래', '라쿤', '스라소니', '두루미'];
  function r(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function makeSuggestions(n = 3) {
    const set = new Set();
    while (set.size < n) { set.add(`${r(adjectives)}${r(animals)}${Math.floor(Math.random() * 90 + 10)}`); }
    return [...set];
  }
  function renderSuggestions() {
    if (!nickList) return;
    nickList.innerHTML = '';
    makeSuggestions(3).forEach(text => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = text;
      btn.addEventListener('click', () => { nickname.value = text; nickname.focus(); validate(); });
      nickList.appendChild(btn);
    });
  }
  nickBtn?.addEventListener('click', renderSuggestions);

  // 이메일/비밀번호 규칙 + 강도 미터
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; // ← 복구(필수)
  function pwScore(pw) {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return Math.min(s, 4);
  }
  function updatePwMeter() {
    if (!pwStrength) return;
    const s = pwScore(password.value);
    pwStrength.setAttribute('data-strength', String(s));
    pwStrength.setAttribute('aria-valuenow', String(s));
    if (pwStrengthText) {
      const labels = ['', '약함', '보통', '강함', '매우 강함'];
      pwStrengthText.textContent = labels[s];
    }
  }
  password.addEventListener('input', () => {
    updatePwMeter();
    updatePwMatch();   
    validate();
  });

  // 약관: 전체 동의/개별 동기화
  function syncAllAgree() {
    const allChecked = Array.from(agreeAllBoxes).every(cb => cb.checked);
    agreeAll.checked = allChecked;
    validate();
  }
  agreeAllBoxes.forEach(cb => cb.addEventListener('change', syncAllAgree));
  agreeAll.addEventListener('change', () => {
    agreeAllBoxes.forEach(cb => cb.checked = agreeAll.checked);
    validate();
  });

  // 유효성 검사 & 버튼 활성화
  function validate() {
    formError.textContent = '';
    let ok = true;

    if (!emailRe.test(email.value)) ok = false;
    if (password.value.length < 8) ok = false;
    if (password.value !== passwordConfirm.value) ok = false;
    if (!nameEl.value.trim()) ok = false;
    if (!nickname.value.trim()) ok = false;
    if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone.value)) ok = false;
    if (!Array.from(agreeRequired).every(cb => cb.checked)) ok = false;

    submitBtn.disabled = !ok;
    return ok;
  }

  // 간단 비밀번호 해시 (SHA-256)로 데모 저장
  async function hash(text) {
    const enc = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  function loadUsers() {
    try { return JSON.parse(localStorage.getItem('users') || '[]'); } catch { return []; }
  }
  function saveUsers(list) { localStorage.setItem('users', JSON.stringify(list)); }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      formError.textContent = '입력값을 다시 확인해주세요.';
      return;
    }

    const users = loadUsers();
    if (users.some(u => u.email === email.value)) {
      formError.textContent = '이미 등록된 이메일입니다.';
      return;
    }

    const passwordHash = await hash(password.value);
    const user = {
      email: email.value,
      passwordHash,
      name: nameEl.value.trim(),
      nickname: nickname.value.trim(),
      phone: phone.value,
      address: {
        zonecode: zonecode.value,
        roadAddress: roadAddress.value,
        detailAddress: detailAddress.value
      },
      marketing: document.getElementById('agreeMarketing').checked,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    saveUsers(users);

    alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
    location.href = './login.html';
  });

  // 불일치 메시지 업데이트
  // 불일치 메시지 업데이트
function updatePwMatch() {
  if (!pwMatchMsg) return;

  // 초기/입력 중: 둘 다 채워지기 전엔 메시지 숨김
  if (!password.value || !passwordConfirm.value) {
    pwMatchMsg.textContent = '';
    pwMatchMsg.classList.remove('error', 'ok');
    passwordConfirm.removeAttribute('aria-invalid');
    return;
  }

  if (password.value !== passwordConfirm.value) {
    pwMatchMsg.textContent = '비밀번호가 일치하지 않습니다.';
    pwMatchMsg.classList.remove('ok');
    pwMatchMsg.classList.add('error');
    passwordConfirm.setAttribute('aria-invalid', 'true');
  } else {
    pwMatchMsg.textContent = '비밀번호가 일치합니다.';
    pwMatchMsg.classList.remove('error');
    pwMatchMsg.classList.add('ok');
    passwordConfirm.removeAttribute('aria-invalid');
  }
}

  // 초기 상태 (중복 제거 + 가드)
  updatePwMeter();
  updatePwMatch();   
  renderSuggestions();
  validate();

  // 실시간 검증 이벤트 (빠진 항목 보강)
  email.addEventListener('input', validate);
  nameEl.addEventListener('input', validate);
  nickname.addEventListener('input', validate);
  passwordConfirm.addEventListener('input', () => {
  updatePwMatch();   // ← 불일치 메시지/aria-invalid 즉시 갱신
  validate();
});

})();
