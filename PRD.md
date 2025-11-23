# AI Tools Bookmark Platform
## Product Requirements Document (PRD)

**버전:** 1.0
**작성일:** 2025년 1월
**기술 스택:** Next.js, Node.js, Shadcn/ui, Vercel

---

## 1. Executive Summary

AI 도구들이 폭발적으로 증가하면서 개인과 팀이 필요한 도구를 체계적으로 관리하고 접근하는 것이 점점 더 어려워지고 있습니다. 본 프로젝트는 사용자가 AI 도구와 웹 서비스를 카테고리별로 정리하고, 시각적인 북마크로 관리할 수 있는 플랫폼을 구축하는 것을 목표로 합니다.

사용자는 자신만의 AI 도구 라이브러리를 구축하고, 팀원과 공유하며, 빠르게 접근할 수 있습니다. 직관적인 UI와 자동 아이콘 추출 기능으로 누구나 쉽게 사용할 수 있는 서비스를 제공합니다.

---

## 2. Product Vision & Goals

### 2.1 Vision
"모든 사용자가 자신의 디지털 도구 생태계를 직관적으로 관리하고, 필요한 순간에 즉시 접근할 수 있는 중앙 허브"

### 2.2 Core Goals
- AI 도구 및 웹 서비스 북마크의 시각적 관리 제공
- 카테고리 기반의 직관적인 정리 시스템 구축
- URL만으로 자동으로 아이콘과 메타데이터를 추출하는 스마트 기능
- 개인화된 도구 컬렉션 및 공유 기능
- 모바일과 데스크톱 모두에서 원활한 사용 경험

---

## 3. Target Users

### 3.1 Primary Users
- **AI 얼리어답터**: 다양한 AI 도구를 적극적으로 탐색하고 사용하는 사용자
- **콘텐츠 크리에이터**: 이미지 생성, 비디오 편집, 텍스트 생성 등 다양한 AI 도구를 활용하는 크리에이터
- **개발자/프로덕트 매니저**: 업무에 필요한 다양한 SaaS 도구를 관리하는 전문가
- **팀 리더**: 팀원들과 도구 리스트를 공유하고 협업하는 사용자

### 3.2 Secondary Users
- **일반 사용자**: 북마크를 시각적으로 관리하고 싶은 모든 사용자
- **학생 및 연구자**: 학습과 연구에 필요한 온라인 리소스를 정리하는 사용자

---

## 4. Core Features (MVP)

### 4.1 도구 관리

#### 4.1.1 도구 추가
- URL 입력으로 자동 메타데이터 추출 (제목, 아이콘, 설명)
- 수동 아이콘 업로드 옵션
- 카테고리 선택 또는 새 카테고리 생성
- 도구 이름 커스터마이징

#### 4.1.2 도구 편집 및 삭제
- 드래그 앤 드롭으로 순서 변경
- 카테고리 간 이동
- 도구 정보 수정
- 도구 삭제 (확인 모달 포함)

### 4.2 카테고리 시스템
- 사전 정의된 카테고리: AI 에이전트, 이미지 생성, 비디오 생성, 코딩, 문서 작성, 등
- 커스텀 카테고리 생성 및 관리
- 카테고리 순서 변경
- 카테고리별 접기/펼치기

### 4.3 사용자 인터페이스
- 그리드 레이아웃: 도구를 아이콘과 이름으로 표시
- 반응형 디자인: 모바일, 태블릿, 데스크톱 최적화
- 검색 기능: 도구 이름 또는 URL로 빠른 검색
- 다크 모드 지원
- 키보드 단축키 지원

### 4.4 사용자 계정
- 소셜 로그인: Google, GitHub
- 이메일 가입/로그인
- 프로필 설정
- 데이터 동기화 (클라우드 저장)

---

## 5. Technical Stack

| Category | Technology |
|----------|-----------|
| Frontend | Next.js 14+ (App Router), React 18+, TypeScript |
| UI Library | Shadcn/ui, Radix UI, Tailwind CSS |
| Backend | Next.js API Routes, Node.js |
| Database | PostgreSQL (Vercel Postgres) + Prisma ORM |
| Authentication | NextAuth.js |
| File Storage | Vercel Blob Storage (아이콘 이미지) |
| Deployment | Vercel |
| State Management | Zustand 또는 React Context |
| Drag & Drop | @dnd-kit/core |

---

## 6. Data Model

### 6.1 User
- `id`: UUID
- `email`: String
- `name`: String
- `avatar`: String (URL)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 6.2 Category
- `id`: UUID
- `userId`: UUID (FK)
- `name`: String
- `order`: Integer
- `isExpanded`: Boolean
- `createdAt`: DateTime

### 6.3 Tool
- `id`: UUID
- `categoryId`: UUID (FK)
- `name`: String
- `url`: String
- `iconUrl`: String
- `description`: String (optional)
- `order`: Integer
- `createdAt`: DateTime
- `updatedAt`: DateTime

---

## 7. Key Pages & User Flow

### 7.1 Landing Page
- 히어로 섹션: 명확한 가치 제안
- 주요 기능 소개 (3-4개 섹션)
- 사용 예시 스크린샷
- CTA 버튼: 무료로 시작하기
- Footer: 링크, 소셜 미디어

### 7.2 Sign Up / Login Page
- 간결한 폼 디자인
- 소셜 로그인 버튼 (Google, GitHub)
- 이메일/비밀번호 로그인

### 7.3 Dashboard (Main Page)
- 헤더: 로고, 검색바, 사용자 프로필
- 카테고리 섹션들
- 각 카테고리 내 도구 그리드
- + 버튼으로 새 도구/카테고리 추가
- 빈 상태: 첫 도구 추가하기 가이드

### 7.4 Add Tool Modal
- 서비스 이름 입력
- URL 입력
- 아이콘 자동 감지 / 직접 업로드 탭
- 카테고리 선택 드롭다운
- 취소/추가 버튼

### 7.5 Settings Page
- 프로필 정보 편집
- 다크 모드 토글
- 데이터 내보내기/가져오기
- 계정 삭제

---

## 8. UI/UX Design Guidelines

### 8.1 Design Principles
- **Simplicity First**: 복잡한 기능보다 직관적인 사용성 우선
- **Visual Focus**: 아이콘과 시각적 요소로 빠른 인식
- **Responsive**: 모든 디바이스에서 일관된 경험
- **Performance**: 빠른 로딩과 부드러운 인터랙션

### 8.2 Color Palette
- Primary: Blue (#3498db)
- Secondary: Gray (#95a5a6)
- Success: Green (#27ae60)
- Warning: Orange (#e67e22)
- Danger: Red (#e74c3c)
- Background Light: #ffffff
- Background Dark: #1a1a1a

### 8.3 Typography
- Primary Font: Inter 또는 System Font Stack
- Heading Scale: 2xl, xl, lg, md
- Body: sm, base

### 8.4 Components (Shadcn/ui)
- Button, Input, Select
- Dialog (Modal)
- Card
- Dropdown Menu
- Tooltip
- Toast (알림)

---

## 9. MVP Scope & Prioritization

### 9.1 Phase 1: Core MVP (4-6주)
- 사용자 인증 (소셜 로그인)
- 도구 CRUD
- 카테고리 관리
- URL 메타데이터 자동 추출
- 기본 대시보드 UI
- 반응형 디자인

### 9.2 Phase 2: Enhancement (2-3주)
- 드래그 앤 드롭 재정렬
- 검색 기능
- 다크 모드
- 설정 페이지
- 성능 최적화

### 9.3 Future Features (Post-MVP)
- 팀 기능 및 공유
- 공개 프로필 페이지
- 태그 시스템
- 도구 사용 통계
- 추천 도구 기능
- 브라우저 확장 프로그램
- 모바일 앱

---

## 10. Success Metrics

### 10.1 User Metrics
- 가입자 수 (월별 증가율)
- 활성 사용자 (DAU, MAU)
- 사용자 유지율 (Retention Rate)

### 10.2 Engagement Metrics
- 평균 추가된 도구 수 (사용자당)
- 평균 세션 시간
- 도구 클릭률

### 10.3 Technical Metrics
- 페이지 로드 시간 < 2초
- API 응답 시간 < 500ms
- 에러율 < 1%
- Lighthouse 점수 > 90
