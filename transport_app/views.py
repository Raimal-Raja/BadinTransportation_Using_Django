from django.shortcuts import render, redirect
from .models import Rider, Booking
from django.http import JsonResponse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import ensure_csrf_cookie
def index(request):
    return render(request, 'index.html')


@ensure_csrf_cookie
def become_rider(request):
    if request.method == "POST":
        try:
            name = request.POST.get("name")
            phone_number = request.POST.get("phone_number")
            location = request.POST.get("location")
            vehicle_type = request.POST.get("vehicle_type")
            vehicle_number = request.POST.get("vehicle_number")
            email = request.POST.get("email")
            password = request.POST.get("password")

            if not all([name, phone_number, location, vehicle_type, vehicle_number, email, password]):
                return JsonResponse({"success": False, "message": "All fields are required"}, status=400)

            if Rider.objects.filter(email=email).exists():
                return JsonResponse({"success": False, "message": "Email already registered"}, status=400)

            # Hash the password before saving
            hashed_password = make_password(password)

            Rider.objects.create(
                name=name,
                phone_number=phone_number,
                location=location,
                vehicle_type=vehicle_type,
                vehicle_number=vehicle_number,
                email=email,
                password=hashed_password  # Save the hashed password
            )

            return JsonResponse({"success": True, "message": "Registration successful"}, status=201)

        except Exception as e:
            return JsonResponse({"success": False, "message": f"Error during registration: {str(e)}"}, status=500)

    return render(request, "become_rider.html")



def book_rider(request):
    if request.method == 'POST':
        # Save booking data to the database
        rider = Rider.objects.filter(vehicle_type=request.POST['vehicle_type'], is_available=True).first()
        if rider:
            Booking.objects.create(
                customer_name=request.POST['customer_name'],
                customer_phone=request.POST['customer_phone'],
                pickup_location=request.POST['pickup_location'],
                destination=request.POST['destination'],
                vehicle_type=request.POST['vehicle_type'],
                rider=rider
            )
            rider.is_available = False
            rider.save()
            return redirect('booking_success')
    riders = Rider.objects.filter(is_available=True)
    return render(request, 'booking.html', {'riders': riders})

def login(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
        rider = Rider.objects.filter(email=email).first()
        if rider and check_password(password, rider.password):
            return redirect('dashboard')
        else:
            return render(request, 'login.html', {'error': 'Invalid email or password'})
    return render(request, 'login.html')

def dashboard(request):
    rider = Rider.objects.first()  # Replace with actual rider logic
    bookings = Booking.objects.filter(rider=rider)
    return render(request, 'deshboard_Rider.html', {'bookings': bookings})

def service(request):
    return render(request, 'service.html')

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            print(f"Login Attempt - Email: {email}, Password: {password}")  # Debug: Log email and password

            # Check if the rider exists
            rider = Rider.objects.filter(email=email).first()
            if not rider:
                print("User does not exist")  # Debug: Log if user doesn't exist
                return JsonResponse({
                    'success': False, 
                    'message': 'User does not exist. Please register first.'
                })
            
            # Verify the password
            if check_password(password, rider.password):
                print("Login Successful")  # Debug: Log successful login
                return JsonResponse({
                    'success': True, 
                    'rider_id': rider.id,
                    'redirect_url': '/dashboard/'
                })
            else:
                print("Invalid Password")  # Debug: Log invalid password
                return JsonResponse({
                    'success': False, 
                    'message': 'Invalid password'
                })
                
        except json.JSONDecodeError:
            print("Invalid Request Format")  # Debug: Log JSON decode error
            return JsonResponse({
                'success': False, 
                'message': 'Invalid request format'
            })
            
    print("Invalid Request Method")  # Debug: Log invalid request method
    return JsonResponse({
        'success': False, 
        'message': 'Invalid request method'
    })
    
    
    
def api_orders(request, rider_id):
    recent_orders = Booking.objects.filter(rider_id=rider_id).order_by('-booking_time')[:5].values(
        'customer_name', 'pickup_location', 'destination')
    previous_orders = Booking.objects.filter(rider_id=rider_id).order_by('-booking_time')[5:].values(
        'customer_name', 'pickup_location', 'destination')
    return JsonResponse({'recent': list(recent_orders), 'previous': list(previous_orders)})


@csrf_exempt
def api_toggle_availability(request, rider_id):
    if request.method == 'POST':
        rider = Rider.objects.get(id=rider_id)
        rider.is_available = not rider.is_available
        rider.save()
        return JsonResponse({'success': True, 'is_available': rider.is_available})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})

# New API endpoints for booking functionality
def api_vehicle_types(request):
    """Return all unique vehicle types from the database"""
    vehicle_types = Rider.objects.values_list('vehicle_type', flat=True).distinct()
    return JsonResponse({'vehicle_types': list(vehicle_types)})

def api_available_riders(request):
    """Return available riders based on vehicle type"""
    vehicle_type = request.GET.get('vehicle_type')
    location = request.GET.get('location', '')  # Optional parameter
    
    if not vehicle_type:
        return JsonResponse({'success': False, 'message': 'Vehicle type is required'})
    
    query = {
        'vehicle_type': vehicle_type,
        'is_available': True
    }
    
    # Add location filter if provided
    if location:
        query['location__icontains'] = location
    
    riders = Rider.objects.filter(**query).values(
        'id',
        'name',
        'phone_number',
        'vehicle_number',
        'location'
    )
    
    return JsonResponse({
        'success': True,
        'riders': list(riders)
    })

@csrf_exempt
def api_create_booking(request):
    """Create a new booking"""
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Invalid request method'})
    
    try:
        data = json.loads(request.body)
        rider = Rider.objects.get(id=data['rider_id'])
        
        # Create booking
        booking = Booking.objects.create(
            customer_name=data['customer_name'],
            customer_phone=data['customer_phone'],
            pickup_location=data['pickup_location'],
            destination=data['destination'],
            vehicle_type=rider.vehicle_type,
            rider=rider
        )
        
        # Update rider availability
        rider.is_available = False
        rider.save()
        
        return JsonResponse({
            'success': True,
            'booking_id': booking.id,
            'message': 'Booking created successfully'
        })
        
    except Rider.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Rider not found'})
    except KeyError as e:
        return JsonResponse({'success': False, 'message': f'Missing required field: {str(e)}'})
    except Exception as e:
        return JsonResponse({'success': False, 'message': f'Error creating booking: {str(e)}'})

def api_get_booking(request, booking_id):
    """Get booking details"""
    try:
        booking = Booking.objects.get(id=booking_id)
        return JsonResponse({
            'success': True,
            'booking': {
                'id': booking.id,
                'customer_name': booking.customer_name,
                'customer_phone': booking.customer_phone,
                'pickup_location': booking.pickup_location,
                'destination': booking.destination,
                'vehicle_type': booking.vehicle_type,
                'rider_name': booking.rider.name,
                'rider_phone': booking.rider.phone_number,
                'vehicle_number': booking.rider.vehicle_number,
                'booking_time': booking.booking_time.strftime('%Y-%m-%d %H:%M:%S')
            }
        })
    except Booking.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Booking not found'})