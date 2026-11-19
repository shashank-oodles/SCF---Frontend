import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { TitleEditorPage } from './pages/TitleEditorPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e8f5ef_0%,_#f4f6f8_45%,_#eef1f5_100%)]">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/titles/:titleId" element={<TitleEditorPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
