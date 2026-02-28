from django.contrib import admin
from .models import (
    Puppy,
    PuppyImage,
    StudDog,
    StudAvailability,
    StudBookingRequest,
    ServiceCategory,
    SubService,
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

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'phone_number', 'email', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_number', 'email')

class PuppyImageInline(admin.TabularInline):
    model = PuppyImage
    extra = 1

@admin.register(Puppy)
class PuppyAdmin(admin.ModelAdmin):
    list_display = ('breed', 'price_display', 'availability', 'dog_type', 'created_at')
    list_filter = ('availability', 'dog_type')
    search_fields = ('breed',)
    inlines = [PuppyImageInline]

class StudAvailabilityInline(admin.TabularInline):
    model = StudAvailability
    extra = 1

@admin.register(StudDog)
class StudDogAdmin(admin.ModelAdmin):
    list_display = ('breed', 'rating', 'pups_produced')
    list_filter = ('breed', 'rating')
    search_fields = ('breed',)
    inlines = [StudAvailabilityInline]

@admin.register(StudAvailability)
class StudAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('stud', 'date', 'note')
    list_filter = ('stud',)
    ordering = ('date',)

@admin.register(StudBookingRequest)
class StudBookingRequestAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'customer_phone', 'stud_breed', 'requested_date', 'requested_time', 'status', 'created_at')
    list_filter = ('status', 'requested_date')
    search_fields = ('customer_name', 'customer_phone', 'stud_breed')
    ordering = ('-created_at',)
    readonly_fields = ('customer_name', 'customer_phone', 'stud_breed', 'requested_date', 'requested_time', 'female_breed_details', 'created_at')

class SubServiceInline(admin.TabularInline):
    model = SubService
    extra = 1

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'tagline', 'price_range')
    inlines = [SubServiceInline]

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'user_phone', 'service_name', 'booking_date', 'booking_time', 'status')
    list_filter = ('status', 'booking_date')
    search_fields = ('user_name', 'user_phone', 'user_email', 'service_name')
    readonly_fields = ('user_name', 'user_phone', 'user_email', 'service_name', 'booking_date', 'booking_time', 'details', 'created_at')


@admin.register(HomeTestimonial)
class HomeTestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'rating', 'display_order', 'is_active')
    list_filter = ('is_active', 'rating')
    search_fields = ('name', 'location', 'text')
    ordering = ('display_order',)


@admin.register(HomeServiceHighlight)
class HomeServiceHighlightAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon_name', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description', 'icon_name')
    ordering = ('display_order',)


@admin.register(Facility)
class FacilityAdmin(admin.ModelAdmin):
    list_display = ('title', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')
    ordering = ('display_order',)


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'display_order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('question', 'answer')
    ordering = ('display_order',)

@admin.register(KennelDetail)
class KennelDetailAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'updated_at')

@admin.register(ContactInquiry)
class ContactInquiryAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_filter = ('subject', 'created_at')
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created_at')
@admin.register(PuppyInquiry)
class PuppyInquiryAdmin(admin.ModelAdmin):
    list_display = ('customer_name', 'puppy', 'customer_phone', 'created_at')
    list_filter = ('puppy__breed', 'created_at')
    search_fields = ('customer_name', 'customer_phone', 'customer_email', 'customer_address')
    readonly_fields = ('customer_name', 'puppy', 'customer_phone', 'customer_email', 'customer_address', 'additional_notes', 'created_at')
