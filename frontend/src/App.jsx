import React, { useState, useEffect } from 'react';
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
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudAvailabilityPage from './pages/StudAvailabilityPage';

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const path = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '');
    return path || 'home';
  });
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPuppy, setSelectedPuppy] = useState(() => {
    const saved = localStorage.getItem('selectedPuppy');
    return saved ? JSON.parse(saved) : null;
  });

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
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [userPhone, setUserPhone] = useState(() => localStorage.getItem('userPhone') || '');
  const [isNavigating, setIsNavigating] = useState(false);

  // Persistence for Wishlist and Cart
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sync state with History API (Back/Forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '');
      setCurrentPage(path || 'home');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync state to URL (Internal navigation)
  useEffect(() => {
    const currentPath = window.location.pathname.replace('/SS-Dog-Kennels/', '').replace('/', '') || 'home';
    if (currentPage !== currentPath) {
      const newPath = currentPage === 'home' ? '/SS-Dog-Kennels/' : `/SS-Dog-Kennels/${currentPage}`;
      window.history.pushState({}, '', newPath);
    }
  }, [currentPage]);

  const handlePuppySelect = (puppy) => {
    setSelectedPuppy(puppy);
    setCurrentPage('puppy-detail');
  };

  const handleLoginSuccess = (phone) => {
    setIsLoggedIn(true);
    setUserPhone(phone);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userPhone', phone);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserPhone('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userPhone');
    setCurrentPage('login');
  };

  const handlePhoneChange = (newPhone) => {
    setUserPhone(newPhone);
    localStorage.setItem('userPhone', newPhone);
  };

  const addToCart = (puppy) => {
    setCart(prev => {
      const exists = prev.find(p => p.breed === puppy.breed);
      if (exists) return prev;
      return [...prev, puppy];
    });
    setCurrentPage('cart');
  };

  const removeFromCart = (puppy) => {
    setCart(prev => prev.filter(p => p.breed !== puppy.breed));
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
    setCurrentPage('booking-wizard');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage
        onPageChange={setCurrentPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'puppies': return <Entries
        onPageChange={setCurrentPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'puppy-detail': return <PuppyDetailPage
        onPageChange={setCurrentPage}
        puppy={selectedPuppy}
        onToggleWishlist={() => toggleWishlist(selectedPuppy)}
        isWishlisted={selectedPuppy && wishlist.some(p => p.id === selectedPuppy.id)}
        onAddToCart={addToCart}
      />;
      case 'stud': return <StudServicesPage onPageChange={setCurrentPage} />;
      case 'stud-availability': return <StudAvailabilityPage onPageChange={setCurrentPage} />;
      case 'services': return <ServicesPage onPageChange={setCurrentPage} onServiceSelect={handleServiceBooking} />;
      case 'booking-wizard': return <BookingWizard onPageChange={setCurrentPage} initialService={selectedService} />;
      case 'wishlist': return <WishlistPage
        onPageChange={setCurrentPage}
        onPuppySelect={handlePuppySelect}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'cart': return <CartPage
        onPageChange={setCurrentPage}
        cart={cart}
        onRemoveFromCart={removeFromCart}
      />;
      case 'profile':
        return isLoggedIn ? (
          <ProfilePage
            onPageChange={setCurrentPage}
            wishlistCount={wishlist.length}
            cartCount={cart.length}
            onLogout={handleLogout}
            userPhone={userPhone}
            onPhoneChange={handlePhoneChange}
          />
        ) : (
          <LoginPage onPageChange={setCurrentPage} onLoginSuccess={handleLoginSuccess} />
        );
      case 'login': return <LoginPage onPageChange={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage onPageChange={setCurrentPage} onPuppySelect={handlePuppySelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-white">
      <Header
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        wishlistCount={wishlist.length}
        cartCount={cart.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      <main className="pt-[56px] lg:pt-[80px]">
        {renderPage()}
      </main>
      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}

// Internal mapping fix
const Entries = (props) => <PuppiesPage {...props} />;

export default App;
