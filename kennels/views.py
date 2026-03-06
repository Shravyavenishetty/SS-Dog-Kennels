from django.db.models import Q
from rest_framework import viewsets, status
from rest_framework.decorators import action
import re
from django.core import signing
from rest_framework.response import Response
from rest_framework.decorators import api_view
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

AUTH_SALT = "kennels.mobile.password.auth"
AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30  # 30 days


def issue_auth_token(phone_number):
    return signing.dumps({"phone_number": phone_number}, salt=AUTH_SALT)


def parse_auth_token(token):
    try:
        payload = signing.loads(token, max_age=AUTH_TOKEN_TTL_SECONDS, salt=AUTH_SALT)
        return payload.get("phone_number")
    except signing.BadSignature:
        return None
    except signing.SignatureExpired:
        return None


def get_bearer_token(request):
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return None
    return auth_header.replace("Bearer ", "", 1).strip() or None


@api_view(['POST'])
def register_with_mobile_password(request):
    name = (request.data.get('name') or '').strip()
    phone_number = (request.data.get('phone_number') or '').strip()
    password = request.data.get('password') or ''

    if not name:
        return Response({'error': 'Name is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if not re.match(r'^[6-9]\d{9}$', phone_number):
        return Response({'error': 'Invalid phone number format.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(password) < 6:
        return Response({'error': 'Password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    if UserProfile.objects.filter(phone_number=phone_number).exists():
        return Response({'error': 'Phone number already registered.'}, status=status.HTTP_400_BAD_REQUEST)

    name_parts = [part for part in name.split() if part]
    first_name = name_parts[0]
    last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''

    profile = UserProfile(
        phone_number=phone_number,
        first_name=first_name,
        last_name=last_name,
        email='',
    )
    profile.set_password(password)
    profile.save()

    return Response({
        'success': True,
        'phone_number': profile.phone_number,
        'name': f"{profile.first_name} {profile.last_name}".strip(),
        'token': issue_auth_token(profile.phone_number),
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login_with_mobile_password(request):
    phone_number = (request.data.get('phone_number') or '').strip()
    password = request.data.get('password') or ''

    if not re.match(r'^[6-9]\d{9}$', phone_number):
        return Response({'error': 'Invalid phone number format.'}, status=status.HTTP_400_BAD_REQUEST)

    profile = UserProfile.objects.filter(phone_number=phone_number).first()
    if not profile or not profile.check_password(password):
        return Response({'error': 'Invalid phone number or password.'}, status=status.HTTP_401_UNAUTHORIZED)

    return Response({
        'success': True,
        'phone_number': profile.phone_number,
        'name': f"{profile.first_name} {profile.last_name}".strip(),
        'token': issue_auth_token(profile.phone_number),
    })


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

    def perform_create(self, serializer):
        password = self.request.data.get('password')
        instance = serializer.save()
        if password:
            instance.set_password(password)
            instance.save()

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

    def create(self, request, *args, **kwargs):
        token = get_bearer_token(request)
        phone_from_token = parse_auth_token(token) if token else None
        if not phone_from_token:
            return Response({'error': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        request_phone = (request.data.get('customer_phone') or '').strip()
        if request_phone and request_phone != phone_from_token:
            return Response({'error': 'Phone mismatch for authenticated user.'}, status=status.HTTP_403_FORBIDDEN)

        mutable_data = request.data.copy()
        mutable_data['customer_phone'] = phone_from_token
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
