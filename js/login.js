/* 로그인 스크립트 (로컬 저장 데이터로 인증) */
(function(){
const form = document.getElementById('loginForm');
const email = document.getElementById('loginEmail');
const password = document.getElementById('loginPassword');
const errorEl = document.getElementById('loginError');


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


function loadUsers(){
try { return JSON.parse(localStorage.getItem('users')||'[]'); } catch { return []; }
}
async function hash(text){
const enc = new TextEncoder().encode(text);
const buf = await crypto.subtle.digest('SHA-256', enc);
return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}


form?.addEventListener('submit', async (e)=>{
e.preventDefault();
errorEl.textContent = '';


const users = loadUsers();
const target = users.find(u => u.email === email.value);
if (!target){
errorEl.textContent = '가입되지 않은 이메일이거나 비밀번호가 올바르지 않습니다.';
return;
}
const pw = await hash(password.value);
if (pw !== target.passwordHash){
errorEl.textContent = '가입되지 않은 이메일이거나 비밀번호가 올바르지 않습니다.';
return;
}


// 로그인 성공 → 세션 저장 후 메인으로 이동
sessionStorage.setItem('currentUserEmail', target.email);
sessionStorage.setItem('currentUserName', target.name);
location.href = './main.html';
});
})();