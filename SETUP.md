# 로그인 설정 가이드

## 1. 이메일/비밀번호 로그인

현재 데모용 하드코딩된 계정이 설정되어 있습니다:
- **이메일**: demo@example.com
- **비밀번호**: demo123

### 실제 데이터베이스 연동하기:

`app/api/auth/[...nextauth]/route.ts` 파일의 `CredentialsProvider`에서 `authorize` 함수를 수정하세요:

```typescript
async authorize(credentials) {
  // 실제 데이터베이스에서 사용자 조회
  const user = await db.user.findUnique({
    where: { email: credentials?.email }
  })

  // 비밀번호 확인 (bcrypt 등 사용)
  const isValid = await comparePassword(
    credentials?.password,
    user?.hashedPassword
  )

  if (user && isValid) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    }
  }

  return null
}
```

---

## 2. Google OAuth 설정

### Google Cloud Console에서 설정하기:

1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. "API 및 서비스" > "사용자 인증 정보"로 이동
4. "사용자 인증 정보 만들기" > "OAuth 클라이언트 ID" 선택
5. 애플리케이션 유형: "웹 애플리케이션" 선택
6. 승인된 리디렉션 URI 추가:
   - 개발: `http://localhost:3000/api/auth/callback/google`
   - 프로덕션: `https://yourdomain.com/api/auth/callback/google`
7. 클라이언트 ID와 클라이언트 보안 비밀번호 복사

### .env.local 파일에 추가:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 3. NEXTAUTH_SECRET 생성

터미널에서 다음 명령어 실행:

```bash
openssl rand -base64 32
```

생성된 값을 .env.local에 추가:
```
NEXTAUTH_SECRET=generated-secret-here
```

---

## 4. 전체 .env.local 예시

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnop
```

---

## 5. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작해야 합니다:

```bash
# 기존 서버 중지 (Ctrl + C)
# 서버 재시작
npm run dev
```

---

## 6. 테스트

### 이메일/비밀번호 로그인:
1. `http://localhost:3000/login`으로 이동
2. 이메일: `demo@example.com`, 비밀번호: `demo123` 입력
3. "로그인" 버튼 클릭

### Google 로그인:
1. `http://localhost:3000/login`으로 이동
2. "Google로 계속하기" 버튼 클릭
3. Google 계정으로 로그인 및 권한 동의
4. 성공적으로 로그인되면 대시보드로 리디렉션됩니다

---

## 주의사항

- `.env.local` 파일은 절대 Git에 커밋하지 마세요
- 프로덕션 배포 시 Google Cloud Console에서 프로덕션 URL도 추가해야 합니다
- NEXTAUTH_SECRET는 프로덕션에서 반드시 강력한 랜덤 값을 사용해야 합니다
- 이메일/비밀번호 로그인을 사용할 경우 반드시 실제 데이터베이스와 연동하세요
- 비밀번호는 반드시 해시화하여 저장하세요 (bcrypt, argon2 등 사용)
