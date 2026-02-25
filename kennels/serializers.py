from rest_framework import serializers
from .models import (
    Puppy,
    StudDog,
    ServiceCategory,
    SubService,
    Booking,
    HomeTestimonial,
    HomeServiceHighlight,
    Facility,
    FAQ,
)

class PuppySerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Puppy
        fields = '__all__'

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
