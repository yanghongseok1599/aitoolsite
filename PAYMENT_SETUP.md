# 토스페이먼츠 결제 설정 가이드

## 1. 토스페이먼츠 가입 및 API 키 발급

### 토스페이먼츠 개발자 센터:
1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)에 접속
2. 회원가입 및 로그인
3. "내 개발정보" 메뉴에서 API 키 확인

### API 키 종류:
- **클라이언트 키 (Client Key)**: 프론트엔드에서 사용 (공개 가능)
- **시크릿 키 (Secret Key)**: 백엔드에서 사용 (절대 공개 금지)

---

## 2. 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# NextAuth (기존)
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production

# Google OAuth (기존)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Kakao OAuth (기존)
KAKAO_CLIENT_ID=your-kakao-client-id
KAKAO_CLIENT_SECRET=your-kakao-client-secret

# 토스페이먼츠 (신규 추가)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_XXXXXXXXXXXXXXXXXXXXXXXXXX
TOSS_SECRET_KEY=test_sk_XXXXXXXXXXXXXXXXXXXXXXXXXX
```

### 주의사항:
- **테스트 키**: `test_ck_`, `test_sk_`로 시작
- **운영 키**: `live_ck_`, `live_sk_`로 시작
- `NEXT_PUBLIC_` 접두사가 붙은 변수만 프론트엔드에서 접근 가능
- `.env.local` 파일은 절대 Git에 커밋하지 마세요 (이미 `.gitignore`에 포함됨)

---

## 3. 테스트 결제 정보

### 테스트 카드 번호:
토스페이먼츠는 테스트 모드에서 다음 카드 번호를 사용할 수 있습니다:

| 카드사 | 카드 번호 | 유효기간 | CVC |
|--------|-----------|----------|-----|
| 신한카드 | 4000-0000-0000-0001 | 임의 (미래) | 임의 3자리 |
| KB국민카드 | 5000-0000-0000-0002 | 임의 (미래) | 임의 3자리 |
| 현대카드 | 4000-0000-0000-0003 | 임의 (미래) | 임의 3자리 |

### 테스트 결제 시나리오:
- **성공**: 일반 카드 번호 사용
- **실패**: 특정 오류 코드 테스트용 카드 번호 사용 (문서 참조)

---

## 4. 결제 흐름

### 전체 프로세스:
```
1. 사용자가 상품 상세 페이지에서 "구매하기" 클릭
   ↓
2. TossPaymentButton 컴포넌트가 /api/payments/create 호출
   ↓
3. 서버에서 주문 정보 생성 및 DB 저장 (TODO)
   ↓
4. 토스페이먼츠 결제창 띄우기
   ↓
5. 사용자가 카드 정보 입력 및 결제
   ↓
6. 결제 성공 시: /payments/success로 리디렉션
   결제 실패 시: /payments/fail로 리디렉션
   ↓
7. /payments/success에서 /api/payments/confirm 호출
   ↓
8. 서버에서 토스페이먼츠 결제 승인 API 호출
   ↓
9. DB에 결제 정보 및 구독 정보 저장 (TODO)
   ↓
10. 사용자에게 결제 완료 메시지 표시
```

---

## 5. 구현해야 할 사항 (TODO)

### 데이터베이스 스키마:

현재 결제 시스템은 데이터베이스 없이 작동하도록 임시 구현되어 있습니다.
실제 운영을 위해서는 다음 테이블을 생성해야 합니다:

#### users 테이블:
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### orders 테이블:
```sql
CREATE TABLE orders (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  order_name VARCHAR(255) NOT NULL,
  amount INT NOT NULL,
  period VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  payment_key VARCHAR(255),
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### subscriptions 테이블:
```sql
CREATE TABLE subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  product_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

### 구현이 필요한 파일:

1. **`app/api/payments/create/route.ts`** (29번째 줄 근처)
   ```typescript
   // TODO: 데이터베이스에 주문 정보 저장
   const order = await db.order.create({
     data: {
       orderId,
       userId: session.user.id,
       productId,
       amount,
       period,
       status: 'pending',
       orderName,
     }
   })
   ```

2. **`app/api/payments/confirm/route.ts`** (50번째 줄 근처)
   ```typescript
   // TODO: 데이터베이스에 결제 정보 업데이트
   await db.order.update({
     where: { orderId },
     data: {
       status: 'completed',
       paymentKey,
       approvedAt: new Date(paymentData.approvedAt),
     }
   })

   // TODO: 사용자 구독 정보 업데이트
   await db.subscription.create({
     data: {
       userId: session.user.id,
       orderId,
       productId: paymentData.productId,
       status: 'active',
       startDate: new Date(),
       endDate: calculateEndDate(paymentData.period),
     }
   })
   ```

---

## 6. 운영 환경 배포 시 체크리스트

### 배포 전 확인사항:
- [ ] 토스페이먼츠 운영 키 (`live_ck_`, `live_sk_`)로 변경
- [ ] 프로덕션 도메인을 `.env` 파일에 설정
- [ ] 데이터베이스 연동 완료
- [ ] 결제 성공/실패 URL이 프로덕션 도메인으로 설정되었는지 확인
- [ ] 토스페이먼츠 개발자센터에서 운영 모드 활성화
- [ ] 정산 계좌 등록 완료

### 보안 체크리스트:
- [ ] `TOSS_SECRET_KEY`가 서버에서만 사용되는지 확인
- [ ] 결제 금액 검증 로직 추가 (클라이언트 금액과 서버 금액 일치 확인)
- [ ] 주문 ID 중복 체크
- [ ] 결제 승인 전 주문 정보 검증

---

## 7. 테스트 방법

### 로컬 환경에서 테스트:

1. **환경 변수 설정 확인**:
   ```bash
   # .env.local 파일이 올바르게 설정되었는지 확인
   cat .env.local
   ```

2. **개발 서버 재시작**:
   ```bash
   npm run dev
   ```

3. **테스트 시나리오 실행**:
   - http://localhost:3002/products 접속
   - 상품 카드에서 "자세히 보기" 클릭
   - "구매하기" 버튼 클릭
   - 토스페이먼츠 결제창에서 테스트 카드 정보 입력
   - 결제 완료 후 성공 페이지 확인

---

## 8. 문제 해결

### 자주 발생하는 오류:

**1. "결제 시스템 설정이 완료되지 않았습니다"**
- 원인: `.env.local`에 `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 없음
- 해결: 환경 변수 추가 후 서버 재시작

**2. "결제 승인 실패"**
- 원인: `TOSS_SECRET_KEY`가 잘못되었거나 없음
- 해결: 토스페이먼츠 개발자센터에서 시크릿 키 재확인

**3. "인증이 필요합니다"**
- 원인: 로그인하지 않은 상태에서 결제 시도
- 해결: 로그인 후 다시 시도

**4. 결제창이 열리지 않음**
- 원인: 토스페이먼츠 SDK 로드 실패
- 해결: 브라우저 콘솔에서 네트워크 오류 확인

---

## 9. 참고 자료

- [토스페이먼츠 개발자 문서](https://docs.tosspayments.com/)
- [토스페이먼츠 API 레퍼런스](https://docs.tosspayments.com/reference)
- [테스트 카드 번호](https://docs.tosspayments.com/guides/test-card)
- [웹훅 가이드](https://docs.tosspayments.com/guides/webhook)

---

## 10. 문의

결제 시스템 관련 문의사항이 있으시면:
- 토스페이먼츠 고객센터: 1544-7772
- 개발자 지원: support@tosspayments.com
