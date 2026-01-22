import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '서비스 이용약관',
  description: '마이 AI 스튜디오 서비스 이용약관',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          서비스 이용약관
        </h1>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            시행일: 2024년 1월 1일
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제1조 (목적)
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              본 약관은 마이 AI 스튜디오(이하 &quot;서비스&quot;)가 제공하는 모든 서비스의 이용 조건 및 절차,
              이용자와 서비스 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제2조 (정의)
            </h2>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>&quot;서비스&quot;란 마이 AI 스튜디오가 제공하는 AI 도구 관리, 북마크, 메모, 일정 관리 등의 기능을 말합니다.</li>
              <li>&quot;이용자&quot;란 본 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
              <li>&quot;회원&quot;이란 서비스에 가입하여 이용자 아이디를 부여받은 자를 말합니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제3조 (약관의 효력 및 변경)
            </h2>
            <ul className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.</li>
              <li>서비스는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내에 공지합니다.</li>
              <li>이용자가 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제4조 (서비스의 제공)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              서비스는 다음과 같은 기능을 제공합니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>AI 도구 북마크 및 관리</li>
              <li>메모 및 노트 기능</li>
              <li>Google 캘린더 연동</li>
              <li>작업 시간 추적</li>
              <li>기타 부가 서비스</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제5조 (회원가입)
            </h2>
            <ul className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>회원가입은 이용자가 약관에 동의하고, Google 계정 등을 통해 인증을 완료함으로써 성립됩니다.</li>
              <li>서비스는 다음 각 호에 해당하는 경우 회원가입을 거절할 수 있습니다:
                <ul className="list-disc pl-6 mt-2">
                  <li>타인의 정보를 도용한 경우</li>
                  <li>서비스 운영을 방해한 이력이 있는 경우</li>
                  <li>기타 관련 법령에 위반되는 경우</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제6조 (이용자의 의무)
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              이용자는 다음 행위를 하여서는 안 됩니다:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>타인의 정보 도용</li>
              <li>서비스의 정상적인 운영 방해</li>
              <li>불법적인 목적으로 서비스 이용</li>
              <li>타인의 권리 침해</li>
              <li>관련 법령 위반 행위</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제7조 (서비스 이용 제한)
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              서비스는 이용자가 본 약관을 위반하거나 서비스의 정상적인 운영을 방해한 경우,
              사전 통지 후 서비스 이용을 제한하거나 회원 자격을 박탈할 수 있습니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제8조 (면책조항)
            </h2>
            <ul className="list-decimal pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>서비스는 천재지변, 시스템 장애 등 불가항력적인 사유로 인한 서비스 중단에 대해 책임지지 않습니다.</li>
              <li>서비스는 이용자가 서비스를 통해 얻은 정보의 정확성, 신뢰성에 대해 보증하지 않습니다.</li>
              <li>서비스는 이용자 간 또는 이용자와 제3자 간의 분쟁에 대해 개입하지 않으며, 이로 인한 손해를 배상할 책임이 없습니다.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제9조 (준거법 및 관할)
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              본 약관의 해석 및 적용에 관하여는 대한민국 법률을 적용하며,
              서비스 이용과 관련하여 분쟁이 발생한 경우 서울중앙지방법원을 전속 관할법원으로 합니다.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              제10조 (문의)
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              서비스 이용에 관한 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              이메일: trainermilestone@gmail.com
            </p>
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
