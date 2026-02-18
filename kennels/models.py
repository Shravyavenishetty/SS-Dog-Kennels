from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django_mongodb_backend.fields import ObjectIdAutoField

class Puppy(models.Model):
    id = ObjectIdAutoField(primary_key=True)
    TYPE_CHOICES = [
        ('Guard Dogs', 'Guard Dogs'),
        ('Pets', 'Pets'),
        ('Working Dogs', 'Working Dogs'),
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
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = "Puppies"

    def __str__(self):
        return f"{self.breed} - {self.price_display}"

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
