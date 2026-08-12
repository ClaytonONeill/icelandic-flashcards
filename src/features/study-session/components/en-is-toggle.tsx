import { useStudySession } from '@/stores/study-session-context'

export function EnIsToggle() {
  const { session, toggleFrontLanguage } = useStudySession()
  if (!session) {
    return null
  }

  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <span className={session.frontLanguage === 'en' ? '' : 'opacity-50'}>
        EN
      </span>
      <input
        type="checkbox"
        className="toggle"
        checked={session.frontLanguage === 'is'}
        onChange={toggleFrontLanguage}
        aria-label="Toggle card front language between English and Icelandic"
      />
      <span className={session.frontLanguage === 'is' ? '' : 'opacity-50'}>
        IS
      </span>
    </label>
  )
}
