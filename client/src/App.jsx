import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { HomePage } from './pages/HomePage';

const AppContent = () => {
  const { isAuthenticated, pendingEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [isOnboardingView, setIsOnboardingView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. If not logged in and not in onboarding creation flow, show Login page
  if (!isAuthenticated && !isOnboardingView && !pendingEmail) {
    return (
      <LoginPage
        onNeedOnboarding={() => {
          setIsOnboardingView(true);
        }}
      />
    );
  }

  // 2. If user just entered an unregistered email OR requested to edit profile, show Onboarding Form
  if (isOnboardingView || (!isAuthenticated && pendingEmail)) {
    return (
      <OnboardingPage
        onComplete={() => {
          setIsOnboardingView(false);
          setActiveTab('feed');
        }}
      />
    );
  }

  // 3. User is authenticated: Show main Home Page with LinkedIn theme
  return (
    <div className="min-h-screen bg-[#f4f2ee] text-gray-900 flex flex-col">
      <Navbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'onboard-edit') {
            setIsOnboardingView(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      <div className="flex-1">
        <HomePage
          initialSearch={searchQuery}
          onEditProfile={() => setIsOnboardingView(true)}
        />
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
