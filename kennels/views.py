from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
import re
from rest_framework.response import Response
from .models import (
    Puppy,
    StudDog,
    StudBookingRequest,
    ServiceCategory,
    Booking,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
    UserProfile,
    KennelDetail,
    ContactInquiry,
    PuppyInquiry,
)
from .serializers import (
    PuppySerializer,
    StudDogSerializer,
    StudBookingRequestSerializer,
    ServiceCategorySerializer,
    BookingSerializer,
    HomeTestimonialSerializer,
    HomeServiceHighlightSerializer,
    FacilitySerializer,
    FAQSerializer,
    UserProfileSerializer,
    KennelDetailSerializer,
    ContactInquirySerializer,
    PuppyInquirySerializer,
)

class PuppyViewSet(viewsets.ModelViewSet):
    queryset = Puppy.objects.all()
    serializer_class = PuppySerializer

class StudDogViewSet(viewsets.ModelViewSet):
    queryset = StudDog.objects.all()
    serializer_class = StudDogSerializer

class StudBookingRequestViewSet(viewsets.ModelViewSet):
    queryset = StudBookingRequest.objects.all()
    serializer_class = StudBookingRequestSerializer
    http_method_names = ['get', 'post', 'head', 'options']  # no delete/patch from public

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
            # Filter by linked profile OR direct phone field
            queryset = queryset.filter(
                Q(user_profile__phone_number=phone) | Q(user_phone=phone)
            )
        return queryset

    def perform_create(self, serializer):
        # Automatically link to UserProfile if it exists for this phone
        user_phone = self.request.data.get('user_phone')
        user_profile = None
        if user_phone:
            user_profile = UserProfile.objects.filter(phone_number=user_phone).first()
        
        serializer.save(user_profile=user_profile)

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

class KennelDetailViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = KennelDetail.objects.all()
    serializer_class = KennelDetailSerializer

class ContactInquiryViewSet(viewsets.ModelViewSet):
    queryset = ContactInquiry.objects.all()
    serializer_class = ContactInquirySerializer
    http_method_names = ['post', 'get', 'head', 'options']

class PuppyInquiryViewSet(viewsets.ModelViewSet):
    queryset = PuppyInquiry.objects.all()
    serializer_class = PuppyInquirySerializer
    http_method_names = ['post', 'get', 'head', 'options']
