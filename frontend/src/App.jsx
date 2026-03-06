import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PuppiesPage from './pages/PuppiesPage';
import PuppyDetailPage from './pages/PuppyDetailPage';
import StudServicesPage from './pages/StudServicesPage';
import ServicesPage from './pages/ServicesPage';
import BookingWizard from './pages/BookingWizard';
import ProfilePage from './pages/DashboardPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudAvailabilityPage from './pages/StudAvailabilityPage';
import PuppyAdoptionWizard from './pages/PuppyAdoptionWizard';
import { clearAuthToken, fetchKennelDetails, setAuthToken } from './lib/api';

const PROTECTED_PAGES = new Set(['contact', 'booking-wizard', 'stud-availability', 'puppy-adoption']);

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '');
    const requestedPage = path || 'home';
    const alreadyLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (PROTECTED_PAGES.has(requestedPage) && !alreadyLoggedIn) {
      return 'login';
    }
    return requestedPage;
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPuppy, setSelectedPuppy] = useState(() => {
    const saved = localStorage.getItem('selectedPuppy');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (!parsed || !parsed.imageFull) {
        localStorage.removeItem('selectedPuppy');
        return null;
      }
      return parsed;
    } catch {
      localStorage.removeItem('selectedPuppy');
      return null;
    }
  });
  const [selectedStud, setSelectedStud] = useState(null);
  const [kennelDetail, setKennelDetail] = useState(null);

  useEffect(() => {
    fetchKennelDetails().then(data => {
      if (data) setKennelDetail(data);
    });
  }, []);

  // Sync selected puppy to localStorage
  useEffect(() => {
    if (selectedPuppy) {
      localStorage.setItem('selectedPuppy', JSON.stringify(selectedPuppy));
    } else {
      localStorage.removeItem('selectedPuppy');
    }
  }, [selectedPuppy]);

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('userPhone') || '');

  const navigateToPage = useCallback((page) => {
    if (PROTECTED_PAGES.has(page) && !isLoggedIn) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync state with History API (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '');
      navigateToPage(path || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigateToPage]);

  // Sync state to URL (Internal navigation)
  useEffect(() => {
    const currentPath = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '') || 'home';
    if (currentPage !== currentPath) {
      const newPath = currentPage === 'home' ? '/SS-Dog-Kennels/' : `/SS-Dog-Kennels/${currentPage}`;
      window.history.pushState({}, '', newPath);
    }
  }, [currentPage]);

  // Ensure each internal page navigation starts at the top.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [currentPage]);

  const handlePuppySelect = (puppy) => {
    setSelectedPuppy(puppy);
    setCurrentPage('puppy-detail');
  };

  const handlePuppyAdoption = (puppy) => {
    setSelectedPuppy(puppy);
    navigateToPage('puppy-adoption');
  };

  const handleLoginSuccess = ({ phone, name, token }) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userName', name || '');
    if (token) setAuthToken(token);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    clearAuthToken();
    setCurrentPage('login');
  };

  const handlePhoneChange = (newPhone) => {
    setUserPhone(newPhone);
    localStorage.setItem('userPhone', newPhone);
  };

  const toggleWishlist = (puppy) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === puppy.id);
      if (exists) {
        return prev.filter(p => p.id !== puppy.id);
      }
      return [...prev, puppy];
    });
  };

  const handleServiceBooking = (serviceId) => {
    setSelectedService(serviceId);
    navigateToPage('booking-wizard');
  };

  const renderPage = () => {
    const loginPage = <LoginPage onPageChange={navigateToPage} onLoginSuccess={handleLoginSuccess} />;

    switch (currentPage) {
      case 'home': return <HomePage
        onPageChange={navigateToPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'puppies': return <Entries
        onPageChange={navigateToPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'puppy-detail': return <PuppyDetailPage
        onPageChange={navigateToPage}
        puppy={selectedPuppy}
        onToggleWishlist={() => toggleWishlist(selectedPuppy)}
        isWishlisted={selectedPuppy && wishlist.some(p => p.id === selectedPuppy.id)}
        onBookPuppy={handlePuppyAdoption}
      />;
      case 'puppy-adoption': return isLoggedIn ? (
        <PuppyAdoptionWizard onPageChange={navigateToPage} puppy={selectedPuppy} />
      ) : loginPage;
      case 'stud': return <StudServicesPage onPageChange={navigateToPage} onStudSelect={(stud) => { setSelectedStud(stud); navigateToPage('stud-availability'); }} />;
      case 'stud-availability': return isLoggedIn ? (
        <StudAvailabilityPage onPageChange={navigateToPage} initialStud={selectedStud} />
      ) : loginPage;
      case 'services': return <ServicesPage onPageChange={navigateToPage} onServiceSelect={handleServiceBooking} />;
      case 'booking-wizard': return isLoggedIn ? (
        <BookingWizard onPageChange={navigateToPage} initialService={selectedService} />
      ) : loginPage;
      case 'wishlist': return <WishlistPage
        onPageChange={navigateToPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'profile':
        return isLoggedIn ? (
          <ProfilePage
            onPageChange={navigateToPage}
            wishlistCount={wishlist.length}
            onLogout={handleLogout}
            userPhone={userPhone}
            onPhoneChange={handlePhoneChange}
            kennelDetail={kennelDetail}
          />
        ) : (
          loginPage
        );
      case 'login': return loginPage;
      case 'register': return <RegisterPage onPageChange={navigateToPage} onRegisterSuccess={handleLoginSuccess} />;
      case 'about': return <AboutPage />;
      case 'contact': return isLoggedIn ? <ContactPage onPageChange={navigateToPage} /> : loginPage;
      default: return <HomePage onPageChange={navigateToPage} onPuppySelect={handlePuppySelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-white">
      <Header
        currentPage={currentPage}
        onPageChange={navigateToPage}
        wishlistCount={wishlist.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="pt-[56px] lg:pt-[80px]">
        {renderPage()}
      </main>
      <Footer onPageChange={navigateToPage} kennelDetail={kennelDetail} />
    </div>
  );
}

// Internal mapping fix
const Entries = (props) => <PuppiesPage {...props} />;

export default App;
