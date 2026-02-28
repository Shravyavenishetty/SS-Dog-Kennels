import requests
from django.core.files.base import ContentFile
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
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
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=3, decimal_places=1, validators=[MinValueValidator(0), MaxValueValidator(5)])
    pups_produced = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.breed})"

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

class Booking(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    user_name = models.CharField(max_length=100)
    user_email = models.EmailField()
    service_name = models.CharField(max_length=200)
    booking_date = models.DateField()
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
    rating = models.PositiveSmallIntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
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