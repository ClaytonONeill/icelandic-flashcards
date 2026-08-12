import { Navigate, useNavigate } from 'react-router-dom'
import { Flashcard } from '@/features/study-session'
import { useStudySession } from '@/stores/study-session-context'

export function StudyRoute() {
  const { session } = useStudySession()
  const navigate = useNavigate()

  if (!session) {
    return <Navigate to="/" replace />
  }

  function handleFinish() {
    navigate('/study/results')
  }

  return <Flashcard onFinish={handleFinish} />
}

export default StudyRoute
