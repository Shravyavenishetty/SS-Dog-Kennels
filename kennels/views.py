from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Puppy,
    StudDog,
    ServiceCategory,
    Booking,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
    UserProfile,
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
    UserProfileSerializer,
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

    def get_queryset(self):
        queryset = super().get_queryset()
        phone = self.request.query_params.get('phone')
        if phone:
            queryset = queryset.filter(user_profile__phone_number=phone)
        return queryset

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = 'phone_number'

    @action(detail=False, methods=['get'], url_path='check/(?P<phone>[^/.]+)')
    def check_phone(self, request, phone=None):
        exists = UserProfile.objects.filter(phone_number=phone).exists()
        return Response({'exists': exists})


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
