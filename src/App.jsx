import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import InterviewPage from './pages/InterviewPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import AssessmentPage from './pages/AssessmentPage';
import BatchAssessmentPage from './pages/BatchAssessmentPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function App() {
    return (
        <Routes>
            <Route path="/assessment/:token" element={<AssessmentPage />} />

            <Route path="/" element={<Layout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route
                    index
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/analyze"
                    element={
                        <ProtectedRoute>
                            <InterviewPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/report/:analysis_id"
                    element={
                        <ProtectedRoute>
                            <ReportPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/batch-create"
                    element={<ProtectedRoute><BatchAssessmentPage /></ProtectedRoute>}
                />
                 <Route
                    path="/admin"
                    element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>}
                />
            </Route>
        </Routes>
    );
}

export default App;