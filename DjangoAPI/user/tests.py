from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from user.models import User, Center, Unit, Place

class UserApiTests(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.center = Center.objects.create(name='Test Center')
        self.unit = Unit.objects.create(name='Test Unit')
        self.place = Place.objects.create(name='Test Place')

    def test_create_user(self):
        data = {
            'profession': 'Test Profession',
            'email': 'test@example.com',
            'last_name': 'Test Last Name',
            'first_name': 'Test First Name',
            'auth_lvl': 1,
            'center': self.center.id,
            'unit': self.unit.id,
            'place': self.place.id
        }

        url = '/user/user'  # Update this based on your actual URL pattern
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        print("Test 'test_create_user' succeeded!")

    def test_get_users(self):
        User.objects.create(
            profession='Test Profession',
            email='test@example.com',
            last_name='Test Last Name',
            first_name='Test First Name',
            auth_lvl=1,
            center=self.center,
            unit=self.unit,
            place=self.place,
        )

        url = '/user/user'  # Update this based on your actual URL pattern
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print("Test 'test_get_users' succeeded!")

    def test_invalid_user_data(self):
        invalid_data = {
            'invalid_field': 'value',
            'center': self.center.id,
            'unit': self.unit.id,
            'place': self.place.id,
        }

        url = '/user/user'  # Update this based on your actual URL pattern
        response = self.client.post(url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print("Test 'test_invalid_user' succeeded!")

