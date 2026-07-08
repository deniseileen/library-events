import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import EventList from './components/EventList'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <EventList />
    </ThemeProvider>
  )
}
