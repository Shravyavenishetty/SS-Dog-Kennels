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
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import StudAvailabilityPage from './pages/StudAvailabilityPage';
import AdminPanelPage from './pages/AdminPanelPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState(null);
  const [wishlist, setWishlist] = useState([]);

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
      case 'home': return <HomePage onPageChange={setCurrentPage} onPuppySelect={() => setCurrentPage('puppy-detail')} />;
      case 'puppies': return <Entries
        onPageChange={setCurrentPage}
        onPuppySelect={() => setCurrentPage('puppy-detail')}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'puppy-detail': return <PuppyDetailPage />;
      case 'stud': return <StudServicesPage onPageChange={setCurrentPage} />;
      case 'stud-availability': return <StudAvailabilityPage onPageChange={setCurrentPage} />;
      case 'services': return <ServicesPage onPageChange={setCurrentPage} onServiceSelect={handleServiceBooking} />;
      case 'booking-wizard': return <BookingWizard onPageChange={setCurrentPage} initialService={selectedService} />;
      case 'wishlist': return <WishlistPage
        onPageChange={setCurrentPage}
        onPuppySelect={() => setCurrentPage('puppy-detail')}
        wishlist={wishlist}
        onToggleWishlist={toggleWishlist}
      />;
      case 'profile': return <ProfilePage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage onPageChange={setCurrentPage} onPuppySelect={() => setCurrentPage('puppy-detail')} />;
    }
  };

  return (
    <div className="min-h-screen bg-ivory-white">
      <Header onPageChange={setCurrentPage} wishlistCount={wishlist.length} />
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
