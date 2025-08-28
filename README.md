# signupTest

HTML5 시맨틱 태그로 만든 **로그인/회원가입 데모** 프로젝트입니다.  
프론트엔드 포트폴리오용으로, 서버 없이 클라이언트 단에서 동작하도록 구성했습니다.

## ✨ 주요 기능
- **회원가입 폼**: 이메일, 비밀번호/비밀번호 확인(보기·숨기기), 이름, 닉네임(간단 AI 추천), 핸드폰번호(자동 하이픈), 주소(카카오 우편번호), 약관 동의(필수/선택, 전체동의)
- **비밀번호 강도 미터**: 강도 막대 + 텍스트(없음/약함/보통/강함/매우 강함)
- **약관 동기화**: 전체 동의 ↔ 개별 필수/선택 체크 자동 동기화
- **로그인**: 로컬 저장 사용자로 인증 후 세션 유지
- **접근성 고려**: aria-live, role, label 연결
- **데모 저장소**: `localStorage`(사용자), `sessionStorage`(세션)

## 🗂 폴더 구조
myPage/
├─ html/
│ ├─ main.html # 소개/랜딩(로그인 상태 표시)
│ ├─ login.html # 로그인
│ └─ signup.html # 회원가입
├─ css/
│ ├─ main.css
│ ├─ login.css
│ └─ signup.css
└─ js/
├─ login.js
└─ signup.js

shell
코드 복사

## 🚀 실행 방법
### 가장 간단히(로컬 파일 오픈)
1. 이 리포지토리를 복제하거나 ZIP 다운로드
2. `myPage/html/main.html`을 브라우저로 열기  
   (카카오 우편번호는 인터넷 연결 필요)

### 간단 서버로 열기(권장)
```bash
# Node가 있으면
npx serve myPage/html
# 또는 VSCode Live Server로 html 폴더 열기
🧩 동작 개요
회원가입 시 브라우저 localStorage.users에 사용자 객체를 저장합니다.

json
코드 복사
{
  "email": "user@example.com",
  "passwordHash": "<SHA-256>",
  "name": "홍길동",
  "nickname": "빠른고양이42",
  "phone": "010-1234-5678",
  "address": { "zonecode": "00000", "roadAddress": "...", "detailAddress": "..." },
  "marketing": true,
  "createdAt": "ISO8601"
}
로그인 성공 시 sessionStorage에 현재 사용자 이메일/이름을 저장하고, 메인에서 환영 문구를 표시합니다.

🛡️ 주의/제한
데모용입니다. 서버 검증/DB/실제 암호화·인증은 포함하지 않습니다.

비밀번호는 클라이언트에서 SHA-256 해시만 하며, 보안 목적이 아닌 UI 데모 수준입니다.

배포 시에는 서버 측 검증, DB 저장, 중복체크 API, CSRF/Rate Limit 등 보안 강화가 필요합니다.

🔗 외부 스크립트
카카오 주소 검색:
//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js
(팝업 차단 해제 필요)

✅ 체크리스트
 시맨틱 태그(header/nav/main/section/article/footer/fieldset/legend/details/summary)

 비밀번호 보기·숨기기 토글

 핸드폰 자동 하이픈

 비밀번호 강도 미터 + 텍스트

 약관 전체동의/필수/선택

 로그인 상태 표시 및 로그아웃
