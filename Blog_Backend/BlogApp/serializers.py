from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'author_name','title','content','created_at','edited']
        extra_kwargs = {'edited':{'read_only':True},'author_name': {'read_only': True},'created_at': {'read_only': True}}
        

class UserSerializer(serializers.ModelSerializer):
    password_confirm = serializers.CharField()
    class Meta:
        model = User
        fields = ['id','username', 'password','password_confirm']
        extra_kwargs = { 'password': {'write_only': True}}

    #def validate_username(self, value):
     #  if User.objects.filter(username=value).exists():
     #      raise serializers.ValidationError(
     #           "User with this username already exists."
     #       )
     #  return value
    
    def validate(self,data):
        password = data.get('password')
        password_confirm = data.get('password_confirm')

        if password != password_confirm:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })
        return data
    

    def create(self, data):
        data.pop('password_confirm')
        return User.objects.create_user(**data)



class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostImage
        fields = ["image"]


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user","full_name","bio","pfp","verified"]