from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PuppyViewSet,
    StudDogViewSet,
    ServiceCategoryViewSet,
    BookingViewSet,
    HomeTestimonialViewSet,
    HomeServiceHighlightViewSet,
    FacilityViewSet,
    FAQViewSet,
    UserProfileViewSet,
)

router = DefaultRouter()
router.register(r'puppies', PuppyViewSet)
router.register(r'stud-dogs', StudDogViewSet)
router.register(r'services', ServiceCategoryViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'testimonials', HomeTestimonialViewSet, basename='testimonial')
router.register(r'home-highlights', HomeServiceHighlightViewSet, basename='home-highlight')
router.register(r'facilities', FacilityViewSet, basename='facility')
router.register(r'faqs', FAQViewSet, basename='faq')

urlpatterns = [
    path('', include(router.urls)),
]
