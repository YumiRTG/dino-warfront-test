import { createRoot } from 'react-dom/client'
import '@fontsource/oswald/500.css'
import '@fontsource/oswald/700.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(<App />)
