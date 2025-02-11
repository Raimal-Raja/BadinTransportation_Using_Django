# 🚗 Local Ride Sharing Service - Badin

## 🌟 Project Overview
A comprehensive ride-sharing platform developed for the Badin community, inspired by Bykea. This web application connects local vehicle owners with passengers, creating employment opportunities while providing convenient transportation services.

### 🎯 Key Features
- Rider registration and management system
- Real-time booking system
- Dynamic vehicle availability status
- Rider dashboard with order management
- Service area visualization with maps
- Live statistics and counters
- Responsive design for all devices

## 🛠️ Technology Stack

### Frontend
- HTML5
- CSS3 (Bootstrap Framework)
- JavaScript
- Maps API Integration

### Backend
- Python (Django Framework)
- SQLite Database

## 📁 Project Structure

```
badin_transport/
├── manage.py
├── badin_transport/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
├── transport_app/
│   ├── migrations/
│   │   └── __init__.py
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   ├── urls.py
├── templates/
│   ├── index.html
│   ├── become_rider.html
│   ├── booking.html
│   ├── login.html
│   ├── deshboard_Rider.html
│   ├── service.html
├── static/
│   ├── css/
│   │   ├── index.css
│   │   ├── become_rider.css
│   │   ├── booking.css
│   │   ├── login.css
│   │   ├── service.css
│   ├── js/
│   │   ├── index.js
│   │   ├── validation_rider.js
│   │   ├── validation_booking.js
│   │   ├── login_validation.js
│   │   ├── dashboard.js
│   │   ├── service.js
│   │   ├── counter.js
│   │   ├── map_integration.js
│   ├── images/
│   │   ├── background.jpg
│   │   ├── service1.jpg
│   │   ├── service2.jpg
```

## 📋 Pages Description

### 1. Home Page (index.html)
- Service introduction
- Interactive carousel
- Navigation menu
- Call-to-action buttons
- Integrated map
- Responsive footer

### 2. Become a Rider (become_rider.html)
- Animated registration form
- Field validations:
  - Name
  - Phone number
  - Service area
  - Vehicle details
  - Email & password
- Success message display
- Login redirection

### 3. Book a Ride (booking.html)
- Animated booking form
- Real-time vehicle availability
- Auto-filled rider details
- Receipt generation
- Location selection

### 4. Rider Dashboard (dashboard_rider.html)
- Order management system
- Recent orders table
- Order history
- Availability toggle
- Vehicle-specific bookings

### 5. Service Page (service.html)
- Service descriptions
- Live statistics
- Interactive map
- Vehicle categories
- Real-time counters

## 🔧 Setup Instructions

### Prerequisites
- Python 3.8+
- Django 3.2+
- Oracle Database 19c+
- Node.js (for npm packages)

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py makemigrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Database Configuration
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'your_db_name',
        'USER': 'your_username',
        'PASSWORD': 'your_password',
        'HOST': 'localhost',
        'PORT': '1521',
    }
}
```

## 🌐 API Integration
## 📊 Database Schema

### Riders Table
- id (Primary Key)
- name
- phone_number
- service_area
- vehicle_type
- vehicle_number
- email
- password
- availability_status

### Bookings Table
- booking_id (Primary Key)
- customer_name
- customer_phone
- pickup_location
- destination
- vehicle_id (Foreign Key)
- booking_status
- timestamp

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- Bootstrap Documentation
- Django Documentation
- SQLite Database Documentation
- Maps API Documentation

## 📞 Contact
Raimal Raja - [raimalrajagoal@gmail.com]
Project Link: [https://github.com/Raimal-Raja/BadinTransportation_Using_Django]
