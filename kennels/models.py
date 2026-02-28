import requests
from django.core.files.base import ContentFile
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator, EmailValidator
from django_mongodb_backend.fields import ObjectIdAutoField
from urllib.parse import urlparse
import os

class Puppy(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    TYPE_CHOICES = [
        ('Guard Dogs', 'Guard Dogs'),
        ('Pets', 'Pets'),
        ('Working Dogs', 'Working Dogs'),
        ('Farm Dogs', 'Farm Dogs'),
    ]
    AVAILABILITY_CHOICES = [
        ('Available Now', 'Available Now'),
        ('Coming Soon', 'Coming Soon'),
        ('Sold Out', 'Sold Out'),
    ]

    breed = models.CharField(max_length=100)
    price = models.IntegerField(validators=[MinValueValidator(0)])
    price_display = models.CharField(max_length=50)
    age = models.CharField(max_length=50)
    availability = models.CharField(max_length=50, choices=AVAILABILITY_CHOICES, default='Available Now')
    dog_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Pets')
    image = models.ImageField(upload_to='puppies/', null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    tagline = models.CharField(max_length=200, default='Elite Heritage & Quality Companion')
    behavior = models.CharField(max_length=100, default='Calm & Trained')
    health_shield = models.CharField(max_length=100, default='Verified')
    
    # Dynamic Description Fields
    description = models.TextField(default='Our puppies come from a lineage of excellence. We ensure every puppy receives individual attention, high-quality nutrition, and early socialization to make their transition to your home seamless and joyful.', blank=True)
    initial_package = models.TextField(default='• Complete Vaccinations Record\n• Microchipping Documentation\n• Beginner\'s Training Guide\n• 14-Day Health Guaranty', blank=True)
    elite_protection = models.TextField(default='This breed is known for its natural guardian instincts. We provide guidance on maintaining their protective yet gentle nature.', blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Puppies"

    def __str__(self):
        return f"{self.breed} - {self.price_display}"

    def save(self, *args, **kwargs):
        # Force re-fetch from URL if image_url has changed or if image is missing
        if self.pk:
            try:
                orig = Puppy.objects.get(pk=self.pk)
                if orig.image_url != self.image_url and self.image_url:
                    self.image = None
            except Puppy.DoesNotExist:
                pass

        if self.image_url and not self.image:
            try:
                response = requests.get(self.image_url)
                if response.status_code == 200:
                    filename = os.path.basename(urlparse(self.image_url).path) or f"{self.breed}_{self.id}.jpg"
                    self.image.save(filename, ContentFile(response.content), save=False)
            except Exception as e:
                print(f"Error fetching image from URL: {e}")
        super().save(*args, **kwargs)

class PuppyImage(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    puppy = models.ForeignKey(Puppy, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='puppies/gallery/', null=True, blank=True)
    image_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.puppy.breed}"

    def save(self, *args, **kwargs):
        # Force re-fetch from URL if image_url has changed or if image is missing
        if self.pk:
            try:
                orig = PuppyImage.objects.get(pk=self.pk)
                if orig.image_url != self.image_url and self.image_url:
                    self.image = None
            except PuppyImage.DoesNotExist:
                pass

        if self.image_url and not self.image:
            try:
                response = requests.get(self.image_url)
                if response.status_code == 200:
                    filename = os.path.basename(urlparse(self.image_url).path) or f"gallery_{self.puppy.breed}_{self.id}.jpg"
                    self.image.save(filename, ContentFile(response.content), save=False)
            except Exception as e:
                print(f"Error fetching gallery image from URL: {e}")
        super().save(*args, **kwargs)

    @property
    def url(self):
        if self.image:
            return self.image.url
        return self.image_url

class StudDog(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    breed = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    pups_produced = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.breed

class StudAvailability(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    stud = models.ForeignKey(StudDog, related_name='booked_dates', on_delete=models.CASCADE, null=True, blank=True)
    date = models.DateField()
    note = models.CharField(max_length=200, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Stud Availabilities"
        unique_together = [('stud', 'date')]
        ordering = ['date']

    def __str__(self):
        stud_breed = self.stud.breed if self.stud else "All Breeds"
        return f"{stud_breed} — Booked: {self.date}"

class StudBookingRequest(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    TIME_CHOICES = [
        ('09:00', '9:00 AM'),
        ('10:00', '10:00 AM'),
        ('11:00', '11:00 AM'),
        ('12:00', '12:00 PM'),
        ('14:00', '2:00 PM'),
        ('15:00', '3:00 PM'),
        ('16:00', '4:00 PM'),
        ('17:00', '5:00 PM'),
    ]
    stud_breed = models.CharField(max_length=100, blank=True, default='Any')
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    female_breed_details = models.TextField(blank=True, default='')
    requested_date = models.DateField()
    requested_time = models.CharField(max_length=10, choices=TIME_CHOICES, default='10:00')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Stud Booking Requests"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer_name} → {self.stud_breed} on {self.requested_date} at {self.requested_time}"

class ServiceCategory(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    title = models.CharField(max_length=100)
    tagline = models.CharField(max_length=200)
    image_url = models.URLField(max_length=500)
    icon_name = models.CharField(max_length=50, help_text="Lucide icon name")
    price_range = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.title

class SubService(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    category = models.ForeignKey(ServiceCategory, related_name='sub_services', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.category.title} - {self.name}"

class UserProfile(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    phone_number = models.CharField(
        max_length=15, 
        unique=True,
        validators=[RegexValidator(r'^[6-9]\d{9}$', 'Enter a valid 10-digit Indian mobile number.')]
    )
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True, validators=[EmailValidator('Enter a valid email address.')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.phone_number})"

class Booking(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    user_profile = models.ForeignKey(UserProfile, related_name='bookings', on_delete=models.CASCADE, null=True, blank=True)
    user_name = models.CharField(max_length=100)
    user_phone = models.CharField(max_length=15, blank=True, default='')
    user_email = models.EmailField()
    service_name = models.CharField(max_length=200)
    booking_date = models.DateField()
    booking_time = models.CharField(max_length=10, default='09:00')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    details = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user_name} - {self.service_name} on {self.booking_date}"


class HomeTestimonial(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    text = models.TextField()
    location = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0, validators=[MinValueValidator(1), MaxValueValidator(5)])
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.name} ({self.location})"


class HomeServiceHighlight(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    icon_name = models.CharField(max_length=50, help_text="Lucide icon name, e.g. award, shield-check")
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title


class Facility(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "Facilities"
        ordering = ["display_order", "title"]

    def __str__(self):
        return self.title


class FAQ(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    question = models.CharField(max_length=255)
    answer = models.TextField()
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "FAQ"
        verbose_name_plural = "FAQs"
        ordering = ["display_order", "question"]

    def __str__(self):
        return self.question

class KennelDetail(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    map_url = models.URLField(max_length=500, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Kennel Details"

    def __str__(self):
        return "Kennel Contact Information"

class ContactInquiry(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    NAME_CHOICES = [
        ('Buying a Puppy', 'Buying a Puppy'),
        ('Booking a Dog', 'Booking a Dog'),
        ('Grooming / Training', 'Grooming / Training'),
        ('General Inquiry', 'General Inquiry'),
    ]
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=50, choices=NAME_CHOICES, default='General Inquiry')
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Contact Inquiries"
        ordering = ['-created_at']

    def __str__(self):
        return f"Inquiry from {self.name} - {self.subject}"
class PuppyInquiry(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    puppy = models.ForeignKey(Puppy, related_name='inquiries', on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    customer_email = models.EmailField()
    customer_address = models.TextField()
    additional_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Puppy Inquiries'
        ordering = ['-created_at']

    def __str__(self):
        return f'Adoption Enquiry for {self.puppy.breed} from {self.customer_name}'
