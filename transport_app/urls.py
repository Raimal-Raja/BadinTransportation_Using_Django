from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('become_rider/', views.become_rider, name='become_rider'),
    path('book_rider/', views.book_rider, name='booking'),
    path('login/', views.login, name='login'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('service/', views.service, name='service'),
    
    # API endpoints
    path('api/vehicle-types/', views.api_vehicle_types, name='api_vehicle_types'),
    path('api/available-riders/', views.api_available_riders, name='api_available_riders'),
    path('api/create-booking/', views.api_create_booking, name='api_create_booking'),
    path('api/booking/<int:booking_id>/', views.api_get_booking, name='api_get_booking'),
    path('api/riders/', views.api_orders, name='api_riders'),
    path('api/riders/<int:rider_id>/', views.api_orders, name='api_rider_detail'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/orders/<int:rider_id>/', views.api_orders, name='api_orders'),
    path('api/toggle-availability/<int:rider_id>/', views.api_toggle_availability, name='api_toggle_availability'),
]