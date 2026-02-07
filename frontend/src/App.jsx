import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPuppy, setSelectedPuppy] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlePuppySelect = (puppy) => {
    setSelectedPuppy(puppy);
    setCurrentPage('puppy-detail');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage('profile');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('login');
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
      const exists = prev.find(p => p.breed === puppy.breed);
      if (exists) {
        return prev.filter(p => p.breed !== puppy.breed);
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
      case 'home': return <HomePage onPageChange={setCurrentPage} onPuppySelect={handlePuppySelect} />;
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
        isWishlisted={selectedPuppy && wishlist.some(p => p.breed === selectedPuppy.breed)}
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
      <Header onPageChange={setCurrentPage} wishlistCount={wishlist.length} cartCount={cart.length} />
      <main className="pt-[80px]">
        {renderPage()}
      </main>
      <Footer onPageChange={setCurrentPage} />
    </div>
  );
}

// Internal mapping fix
const Entries = (props) => <PuppiesPage {...props} />;

export default App;
