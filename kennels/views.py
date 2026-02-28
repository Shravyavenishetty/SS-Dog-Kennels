from rest_framework import viewsets, status
from rest_framework.decorators import action
import re
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
        
    @action(detail=True, methods=['post'], url_path='change-phone')
    def change_phone(self, request, phone_number=None):
        instance = self.get_object()
        new_phone = request.data.get('new_phone')
        
        if not new_phone or not re.match(r'^[6-9]\d{9}$', new_phone):
            return Response({'error': 'Invalid phone number format'}, status=status.HTTP_400_BAD_REQUEST)
            
        if UserProfile.objects.filter(phone_number=new_phone).exists():
            return Response({'error': 'Phone number already registered'}, status=status.HTTP_400_BAD_REQUEST)
            
        instance.phone_number = new_phone
        instance.save()
        
        return Response({'success': True, 'new_phone': new_phone})
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


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
