from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import (
    Puppy,
    PuppyImage,
    StudDog,
    StudAvailability,
    StudBookingRequest,
    ServiceCategory,
    SubService,
    Booking,
    UserProfile,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
    KennelDetail,
    ContactInquiry,
    PuppyInquiry,
)

def resolve_cloudinary_media_url(file_field, fallback_url=None, transformation=None):
    if file_field and getattr(file_field, "name", None):
        options = {"secure": True}
        if transformation:
            options["transformation"] = transformation
        generated_url, _ = cloudinary_url(file_field.name, **options)
        if generated_url:
            return generated_url
        try:
            return file_field.url
        except Exception:
            pass
    return fallback_url

class PuppyImageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    url = serializers.SerializerMethodField()

    class Meta:
        model = PuppyImage
        fields = ['id', 'url']

    def get_url(self, obj):
        return resolve_cloudinary_media_url(obj.image, obj.image_url)

class PuppyImageAdminSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PuppyImage
        fields = ['id', 'puppy', 'image', 'image_url', 'url', 'created_at']
        read_only_fields = ['id', 'url', 'created_at']

    def get_url(self, obj):
        return resolve_cloudinary_media_url(obj.image, obj.image_url)

class PuppySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    images = PuppyImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    image_thumb_url = serializers.SerializerMethodField()

    class Meta:
        model = Puppy
        fields = [
            'id', 'breed', 'price', 'price_display', 'age', 'availability', 
            'dog_type', 'image', 'image_url', 'image_thumb_url', 'tagline', 'behavior', 'health_shield', 
            'description', 'initial_package', 'elite_protection',
            'images', 'created_at'
        ]
    
    def get_image_url(self, obj):
        return resolve_cloudinary_media_url(obj.image, obj.image_url)

    def get_image_thumb_url(self, obj):
        return resolve_cloudinary_media_url(
            obj.image,
            obj.image_url,
            transformation=[
                {"width": 480, "height": 480, "crop": "pad", "background": "auto"},
                {"quality": "auto", "fetch_format": "auto"},
            ],
        )

class StudAvailabilitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = StudAvailability
        fields = ['id', 'date', 'note']

class StudBookingRequestSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = StudBookingRequest
        fields = ['id', 'stud_breed', 'customer_name', 'customer_phone',
                  'female_breed_details', 'requested_date', 'requested_time', 'status', 'created_at']
        read_only_fields = ['id', 'status', 'created_at']

class StudDogSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    booked_dates = StudAvailabilitySerializer(many=True, read_only=True)

    class Meta:
        model = StudDog
        fields = ['id', 'breed', 'rating', 'pups_produced', 'image_url', 'booked_dates', 'created_at']

class SubServiceSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = SubService
        fields = ['id', 'name']

class ServiceCategorySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    sub_services = SubServiceSerializer(many=True, read_only=True)
    
    class Meta:
        model = ServiceCategory
        fields = ['id', 'title', 'tagline', 'image_url', 'icon_name', 'price_range', 'sub_services']

class UserProfileSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = ['id', 'phone_number', 'first_name', 'last_name', 'email', 'created_at']
        read_only_fields = ['id', 'created_at']

class BookingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    user_profile_details = UserProfileSerializer(source='user_profile', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'user_profile', 'user_profile_details', 'user_name', 
            'user_phone', 'user_email', 'service_name', 'booking_date', 
            'booking_time', 'status', 'details', 'created_at'
        ]


class HomeTestimonialSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = HomeTestimonial
        fields = '__all__'


class HomeServiceHighlightSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = HomeServiceHighlight
        fields = '__all__'


class FacilitySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Facility
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = FAQ
        fields = '__all__'

class KennelDetailSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = KennelDetail
        fields = '__all__'

class ContactInquirySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    class Meta:
        model = ContactInquiry
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
class PuppyInquirySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    puppy_breed = serializers.CharField(source='puppy.breed', read_only=True)
    class Meta:
        model = PuppyInquiry
        fields = '__all__'
        read_only_fields = ['id', 'created_at']
