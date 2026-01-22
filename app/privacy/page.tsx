import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침',
  description: '마이 AI 스튜디오 개인정보처리방침',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          개인정보처리방침
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            시행일: 2024년 1월 1일
          </p>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            마이 AI 스튜디오(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며,
            「개인정보 보호법」을 준수하고 있습니다. 본 개인정보처리방침을 통해
            이용자의 개인정보가 어떻게 수집, 이용, 보호되는지 알려드립니다.
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. 수집하는 개인정보 항목
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              서비스는 다음과 같은 개인정보를 수집합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>필수 항목:</strong> 이메일 주소, 이름(닉네임), 프로필 사진</li>
              <li><strong>Google 로그인 시:</strong> Google 계정 정보 (이메일, 이름, 프로필 사진)</li>
              <li><strong>서비스 이용 시:</strong> 북마크 데이터, 메모 내용, 일정 정보</li>
              <li><strong>자동 수집:</strong> 접속 로그, IP 주소, 브라우저 정보, 서비스 이용 기록</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. 개인정보 수집 및 이용 목적
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>회원 가입 및 관리</li>
              <li>서비스 제공 및 기능 개선</li>
              <li>Google 캘린더 연동 서비스 제공</li>
              <li>이용자 맞춤형 서비스 제공</li>
              <li>서비스 이용 통계 분석</li>
              <li>불법 이용 방지 및 서비스 보안</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. 개인정보의 보유 및 이용 기간
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              이용자의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지</li>
              <li><strong>서비스 이용 기록:</strong> 회원 탈퇴 후 30일</li>
              <li><strong>관련 법령에 의한 보존:</strong> 해당 법령에서 정한 기간</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mt-4">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Google API 서비스 이용
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              서비스는 Google API 서비스를 이용하여 다음 기능을 제공합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Google 로그인:</strong> 간편한 회원가입 및 로그인</li>
              <li><strong>Google 캘린더:</strong> 일정 조회 및 관리 (읽기 권한)</li>
              <li><strong>Gmail:</strong> 이메일 정보 조회 (읽기 권한, 선택적)</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mt-4">
              Google API를 통해 수집된 정보는 해당 기능 제공 목적으로만 사용되며,
              Google의 <a href="https://policies.google.com/privacy" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">개인정보처리방침</a>도 함께 적용됩니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. 개인정보의 파기
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              서비스는 개인정보 보유 기간의 경과, 처리 목적 달성 등 개인정보가 불필요하게 되었을 때에는
              지체 없이 해당 개인정보를 파기합니다. 전자적 파일 형태의 정보는 복구할 수 없는 방법으로 영구 삭제하며,
              종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. 이용자의 권리
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              이용자는 언제든지 다음과 같은 권리를 행사할 수 있습니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>개인정보 열람 요청</li>
              <li>개인정보 정정 요청</li>
              <li>개인정보 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. 개인정보 보호를 위한 기술적 대책
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>개인정보는 암호화되어 저장 및 관리됩니다.</li>
              <li>해킹이나 바이러스 등에 대응하기 위한 보안 프로그램을 설치·운영합니다.</li>
              <li>개인정보에 대한 접근 권한을 최소화합니다.</li>
              <li>SSL/TLS를 통한 암호화 통신을 사용합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. 쿠키(Cookie)의 사용
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              서비스는 이용자에게 개인화된 서비스를 제공하기 위해 쿠키를 사용합니다.
              이용자는 브라우저 설정을 통해 쿠키의 저장을 거부할 수 있으나,
              이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. 개인정보처리방침 변경
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              본 개인정보처리방침은 법령이나 서비스 변경사항을 반영하기 위해 수정될 수 있습니다.
              변경 시에는 서비스 내 공지사항을 통해 안내드립니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              11. 개인정보 보호책임자
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              개인정보 처리에 관한 업무를 총괄하며, 이용자의 불만 처리 및 피해 구제를 위해
              아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300">
                <strong>이메일:</strong> trainermilestone@gmail.com
              </p>
            </div>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← 홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
