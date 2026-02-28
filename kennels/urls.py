from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PuppyViewSet,
    StudDogViewSet,
    StudBookingRequestViewSet,
    ServiceCategoryViewSet,
    BookingViewSet,
    HomeTestimonialViewSet,
    HomeServiceHighlightViewSet,
    FacilityViewSet,
    FAQViewSet,
    UserProfileViewSet,
    KennelDetailViewSet,
    ContactInquiryViewSet,
    PuppyInquiryViewSet,
)

router = DefaultRouter()
router.register(r'puppies', PuppyViewSet)
router.register(r'stud-dogs', StudDogViewSet)
router.register(r'stud-booking-requests', StudBookingRequestViewSet)
router.register(r'services', ServiceCategoryViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'testimonials', HomeTestimonialViewSet, basename='testimonial')
router.register(r'home-highlights', HomeServiceHighlightViewSet, basename='home-highlight')
router.register(r'facilities', FacilityViewSet, basename='facility')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'kennel-details', KennelDetailViewSet, basename='kennel-detail')
router.register(r'contact-inquiries', ContactInquiryViewSet, basename='contact-inquiry')
router.register(r'puppy-inquiries', PuppyInquiryViewSet, basename='puppy-inquiry')

urlpatterns = [
    path('', include(router.urls)),
]
