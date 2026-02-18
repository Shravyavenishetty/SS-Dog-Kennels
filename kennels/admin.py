from django.contrib import admin
from .models import Puppy, StudDog, ServiceCategory, SubService, Booking

@admin.register(Puppy)
class PuppyAdmin(admin.ModelAdmin):
    list_display = ('breed', 'price_display', 'availability', 'dog_type', 'created_at')
    list_filter = ('availability', 'dog_type')
    search_fields = ('breed',)

@admin.register(StudDog)
class StudDogAdmin(admin.ModelAdmin):
    list_display = ('name', 'breed', 'rating', 'pups_produced')
    list_filter = ('breed', 'rating')
    search_fields = ('name', 'breed')

class SubServiceInline(admin.TabularInline):
    model = SubService
    extra = 1

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'tagline', 'price_range')
    inlines = [SubServiceInline]

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'service_name', 'booking_date', 'status')
    list_filter = ('status', 'booking_date')
    search_fields = ('user_name', 'user_email', 'service_name')
