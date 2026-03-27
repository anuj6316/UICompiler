from django.shortcuts import render
from django.core.mail import send_mail as sent_mail
from django.conf import settings

import random

from .serializers import *
from .models import EmailOTP

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

import logging

logger = logging.getLogger(__name__)

# Create your views here.
class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        email = request.data.get('email')

        if not email:
            return Response({"msg": "Email is required"}, status = status.HTTP_400_BAD_REQUEST)

        EmailOTP.objects.filter(email=email).delete() ## step-1 delete the already present mail data
        otp = random.randint(100000, 999999)
        EmailOTP.objects.create(email=email, otp=otp)

        sent_mail(
            subject = "Otp has been sent",
            message = f"Your otp is {otp}",
            from_email = "noreply@gmail.com",
            recipient_list = [email],
            fail_silently = False
        )

        return Response({"msg": "OTP sent successfully", "otp": otp}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def signup(self, request):
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info(serializer.data)
            return Response({"msg": "User created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"msg": "Something went wrong", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        serializers = LoginSerializer(data=request.data)
        if serializers.is_valid():
            return Response({"msg": "User logged in successfully", "data": serializers.data}, status=status.HTTP_200_OK)
        return Response({"msg": "Something went wrong", "data": serializers.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes = [IsAuthenticated])
    def logout(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"msg": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"msg": "User logged out successfully"}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], permission_classes = [IsAuthenticated])
    def change_password(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data.get('old_password')):
                return Response({"msg": "Old password is incorrect"}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({"msg": "Password changed successfully"}, status=status.HTTP_200_OK)

        return Response({"msg": "Something went wrong", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def reset_password(self, request):
        serializer = ResetPasswordSerializer(data=request.data)

        if serializer.is_valid():
            user = CustomUser.objects.filter(email=serializer.data.get('email')).first()
            user.set_password(serializer.data.get('new_password'))
            user.save()
            EmailOTP.objects.filter(email=user.email).delete()
            return Response({"msg": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response({"msg": "Something went wrong", "data": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

