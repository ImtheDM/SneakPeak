import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Header';
import { CompaniesPage } from './pages/CompaniesPage';
import { TrackerPage } from './pages/TrackerPage';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header theme={theme} onToggleTheme={toggleTheme} />
        <Routes>
          <Route path="/" element={<CompaniesPage />} />
          <Route path="/company/:company" element={<TrackerPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
