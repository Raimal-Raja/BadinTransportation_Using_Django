from django.db import models
from django.contrib.auth.hashers import make_password


class Rider(models.Model):
    name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15)
    location = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50)
    vehicle_number = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)  # Ensure this stores hashed passwords
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Booking(models.Model):
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    pickup_location = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    vehicle_type = models.CharField(max_length=50)
    rider = models.ForeignKey(Rider, on_delete=models.CASCADE)
    booking_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.customer_name}"