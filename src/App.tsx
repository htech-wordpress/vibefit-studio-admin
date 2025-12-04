import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import ServicesPrograms from './pages/ServicesPrograms';
import WhatsAppSettings from './pages/WhatsAppSettings';
import ContactSubmissions from './pages/ContactSubmissions';
import GalleryManager from './pages/GalleryManager';
import TestimonialManager from './pages/TestimonialManager';
import SocialMedia from './pages/SocialMedia';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/customers" element={<CustomerList />} />
                  <Route path="/services" element={<ServicesPrograms />} />
                  <Route path="/whatsapp" element={<WhatsAppSettings />} />
                  <Route path="/contact" element={<ContactSubmissions />} />
                  <Route path="/gallery" element={<GalleryManager />} />
                  <Route path="/testimonials" element={<TestimonialManager />} />
                  <Route path="/social" element={<SocialMedia />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
