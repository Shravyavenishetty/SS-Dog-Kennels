from rest_framework import viewsets
from .models import (
    Puppy,
    StudDog,
    ServiceCategory,
    Booking,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
)
from .serializers import (
    PuppySerializer,
    StudDogSerializer,
    ServiceCategorySerializer,
    BookingSerializer,
    HomeTestimonialSerializer,
    HomeServiceHighlightSerializer,
    FacilitySerializer,
    FAQSerializer,
)

class PuppyViewSet(viewsets.ModelViewSet):
    queryset = Puppy.objects.all()
    serializer_class = PuppySerializer

class StudDogViewSet(viewsets.ModelViewSet):
    queryset = StudDog.objects.all()
    serializer_class = StudDogSerializer

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class HomeTestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomeTestimonial.objects.filter(is_active=True).order_by("display_order")
    serializer_class = HomeTestimonialSerializer


class HomeServiceHighlightViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HomeServiceHighlight.objects.filter(is_active=True).order_by("display_order")
    serializer_class = HomeServiceHighlightSerializer


class FacilityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Facility.objects.filter(is_active=True).order_by("display_order")
    serializer_class = FacilitySerializer


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.filter(is_active=True).order_by("display_order")
    serializer_class = FAQSerializer
