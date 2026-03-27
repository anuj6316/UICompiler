from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import CustomUser, EmailOTP

class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    otp = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'otp']
    
    def validate(self, value):
        email = value.get('email')
        otp_sent = value.get("otp")

        otp_record = EmailOTP.objects.filter(email=email, otp=otp_sent).first()
        if not otp_record:
            raise serializers.ValidationError('Invalid OTP')
        if not otp_record.is_valid():
            raise serializers.ValidationError('OTP has expired')

        return value


    def create(self, validated_data):
        validated_data.pop('otp')
        validated_data['is_email_verified'] = True
        user = CustomUser.objects.create_user(**validated_data)
        EmailOTP.objects.filter(email=user.email).delete()
        return user

class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attr):
        if attr.get('new_password') != attr.get('confirm_password'):
            raise serializers.ValidationError('Passwords do not match')
        return attr

class ResetPasswordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    def validate(self, attr):
        if attr.get('new_password') != attr.get('confirm_password'):
            raise serializers.ValidationError('Passwords do not match')
        
        otp_record = EmailOTP.objects.filter(email=attr.get("email")).first()
        if not otp_record or not otp_record.is_valid():
            raise serializers.ValidationError('Invalid OTP or OTP has expired')

        return attr


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    refresh_token = serializers.CharField(read_only=True)
    access_token = serializers.CharField(read_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid credentials')
        refresh = RefreshToken.for_user(user)
        attrs['refresh_token'] = str(refresh)
        attrs['access_token'] = str(refresh.access_token)
        return attrs

    class Meta:
        model = CustomUser
        fields = ['email', 'password']