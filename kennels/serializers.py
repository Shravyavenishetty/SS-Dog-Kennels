from rest_framework import serializers
from .models import (
    Puppy,
    PuppyImage,
    StudDog,
    ServiceCategory,
    SubService,
    Booking,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
)

class PuppyImageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    url = serializers.ReadOnlyField()

    class Meta:
        model = PuppyImage
        fields = ['id', 'url']

class PuppySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)
    images = PuppyImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Puppy
        fields = [
            'id', 'breed', 'price', 'price_display', 'age', 'availability', 
            'dog_type', 'image', 'image_url', 'tagline', 'behavior', 'health_shield', 
            'images', 'created_at'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return obj.image_url

class StudDogSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = StudDog
        fields = '__all__'

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

class BookingSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'


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