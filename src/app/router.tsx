import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './routes/layout'
import { DeckBuilderRoute } from './routes/deck-builder'
import { LoginRoute } from './routes/login'
import { SignupRoute } from './routes/signup'
import { StudyRoute } from './routes/study'
import { StudyResultsRoute } from './routes/study-results'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/signup',
    element: <SignupRoute />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DeckBuilderRoute /> },
      { path: 'study', element: <StudyRoute /> },
      { path: 'study/results', element: <StudyResultsRoute /> },
    ],
  },
])
