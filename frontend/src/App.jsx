import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SpaceListPage from './pages/SpaceListPage.jsx'
import SpaceDetailPage from './pages/SpaceDetailPage.jsx'
import ReservationConfirmPage from './pages/ReservationConfirmPage.jsx'
import MyReservationsPage from './pages/MyReservationsPage.jsx'
import ReservationDetailPage from './pages/ReservationDetailPage.jsx'
import AdminSpacesPage from './pages/admin/AdminSpacesPage.jsx'
import AdminSpaceFormPage from './pages/admin/AdminSpaceFormPage.jsx'
import AdminReservationsPage from './pages/admin/AdminReservationsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<RequireAuth />}>
              <Route path="/spaces" element={<SpaceListPage />} />
              <Route path="/spaces/:id" element={<SpaceDetailPage />} />
            </Route>

            <Route element={<RequireAuth role="MEMBER" />}>
              <Route path="/reservations" element={<MyReservationsPage />} />
              <Route path="/reservations/new" element={<ReservationConfirmPage />} />
              <Route path="/reservations/:id" element={<ReservationDetailPage />} />
            </Route>

            <Route element={<RequireAuth role="ADMIN" />}>
              <Route path="/admin/spaces" element={<AdminSpacesPage />} />
              <Route path="/admin/spaces/new" element={<AdminSpaceFormPage />} />
              <Route path="/admin/spaces/:id/edit" element={<AdminSpaceFormPage />} />
              <Route path="/admin/reservations" element={<AdminReservationsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/spaces" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
