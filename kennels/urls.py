from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PuppyViewSet, StudDogViewSet, ServiceCategoryViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'puppies', PuppyViewSet)
router.register(r'stud-dogs', StudDogViewSet)
router.register(r'services', ServiceCategoryViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
