import { Component, type ErrorInfo, type ReactNode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { useQueryClient } from '@tanstack/react-query'

import { Navbar } from '@/app/(platform)/(app)/_componets/navbar'
import { Dashboard } from '@/app/(platform)/(app)/team/dashboard'
import { Sidebar } from '@/app/(platform)/(app)/team/_components/sidebar'
import { TeamSettings } from '@/app/(platform)/(app)/team/settings/team-settings'
import { TeamSelection } from '@/app/(platform)/(auth)/team-selection/team-selection'
import { Board } from '@/app/(platform)/(app)/board/[id]/board'
import { TanstackQueryClientProvider } from '@/providers/query-client.provider'
import { ModalProvider } from '@/providers/modal.provider'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { useGetActiveTeam } from '@/hooks/teams'
import { useProjectDetails } from '@/hooks/projects'
import { useCardModal } from '@/hooks/useCardModal'
import { getActivity, resetDemo } from './store'
import { usePathname, useRouter } from './navigation'

import '@/app/globals.scss'
import './style.css'

function RestartButton() {
  const client = useQueryClient()
  const { push } = useRouter()
  const [confirm, setConfirm] = useState(false)

  function reset() {
    resetDemo()
    useCardModal.getState().onClose()
    client.clear()
    push('/team')
    setConfirm(false)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  return confirm ? (
    <span className="flex gap-2 items-center">
      <span>Reset local changes?</span>
      <button onClick={reset}>Reset</button>
      <button onClick={() => setConfirm(false)}>Cancel</button>
    </span>
  ) : <button onClick={() => setConfirm(true)}>Reset demo</button>
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false }

  static getDerivedStateFromError() {
    return { error: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Evic demo screen error', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <main className="demo-empty">
          <h1>This demo screen could not load</h1>
          <p>Return to the sample workspace to continue.</p>
          <Button onClick={() => { window.location.hash = '/team'; this.setState({ error: false }) }}>Your boards</Button>
        </main>
      )
    }

    return this.props.children
  }
}

function BoardScreen({ id }: { id: string }) {
  const { project, isLoading } = useProjectDetails(id)

  if (!isLoading && !project) {
    return <div className="demo-empty"><h1>Board unavailable</h1><a href="#/team">Return to your boards</a></div>
  }

  return <Board projectId={id} />
}

function ActivityScreen() {
  const activity = getActivity()

  return (
    <section className="demo-panel">
      <h1>Workspace activity</h1>
      <p>Actions performed in this demo workspace.</p>
      <ul className="demo-activity">
        {activity.map(item => <li key={item.id}><span>{item.text}</span><time>{new Date(item.createdAt).toLocaleString()}</time></li>)}
      </ul>
      {!activity.length && <p>No activity yet. Create a board or edit a card to get started.</p>}
    </section>
  )
}

function BillingScreen() {
  const [plan, setPlan] = useState('Free')

  return (
    <section className="demo-panel">
      <h1>Workspace plan</h1>
      <p>Preview plan selection. No payment details or charges are involved.</p>
      <div className="demo-plans">
        {['Free', 'Pro', 'Business'].map(name => (
          <article key={name}>
            <h2>{name}</h2>
            <p>{name === 'Free' ? 'Personal boards and small teams' : name === 'Pro' ? 'More room for growing teams' : 'Organization-wide collaboration'}</p>
            <Button variant={plan === name ? 'primary' : 'outline'} onClick={() => setPlan(name)}>{plan === name ? 'Selected in demo' : 'Try this plan'}</Button>
          </article>
        ))}
      </div>
    </section>
  )
}

function App() {
  const path = usePathname()
  const { push } = useRouter()
  const { data: active, isLoading } = useGetActiveTeam()
  const isBoard = path.startsWith('/board/')
  const isEntry = ['/sign-in', '/sign-up'].includes(path)
  const isTeamSelection = path === '/team-selection' || (!isLoading && !active?.activeTeamId && !isEntry)
  let content: ReactNode

  if (isEntry) {
    content = (
      <main className="demo-empty">
        <h1>Explore Evic</h1>
        <p>A sample workspace, ready to use. No registration or password required.</p>
        <Button variant="primary" onClick={() => push('/team')}>Enter demo workspace</Button>
      </main>
    )
  } else if (isTeamSelection) {
    content = <main className="demo-empty"><TeamSelection /><a href="#/team">Back to workspace</a></main>
  } else if (isBoard) {
    content = <BoardScreen id={path.split('/')[2]} />
  } else {
    content = (
      <main className="demo-workspace">
        <div className="demo-sidebar"><Sidebar /></div>
        <div className="demo-content" key={active?.activeTeamId}>
          {path === '/team/settings' ? <TeamSettings />
            : path === '/team/activity' ? <ActivityScreen />
              : path === '/team/billing' ? <BillingScreen />
                : path === '/team' || path === '/' ? <Dashboard />
                  : <section className="demo-panel"><h1>Page not found</h1><a href="#/team">Return to your boards</a></section>}
        </div>
      </main>
    )
  }

  return (
    <>
      <div className="demo-banner">
        <span><strong>EVIC DEMO</strong><span className="demo-banner-detail"> · Sample data · Changes saved in this browser · No emails sent</span></span>
        <RestartButton />
      </div>
      {!isEntry && <Navbar />}
      <ErrorBoundary key={`${path}-${active?.activeTeamId}`}>
        {content}
        <ModalProvider />
      </ErrorBoundary>
      <Toaster />
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <TanstackQueryClientProvider><App /></TanstackQueryClientProvider>,
)
