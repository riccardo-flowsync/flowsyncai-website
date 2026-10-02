import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { loaders } from './lib/pages'
import { pagePath } from './lib/routes'

// Keep static content visible until the initial route is ready. This runs after module
// evaluation so a route chunk can import shared entry code without an await cycle.
async function start() {
  const initialPath = pagePath(location.pathname)
  const Page = loaders[initialPath] ? (await loaders[initialPath]()).default : null
  const initialPage = Page ? <Page service={initialPath === '/sales-outreach' ? 'outbound' : 'support'} /> : null
  createRoot(document.getElementById('root')).render(
    <StrictMode><App initialPage={initialPage} initialPath={initialPath} /></StrictMode>,
  )
}
start()
