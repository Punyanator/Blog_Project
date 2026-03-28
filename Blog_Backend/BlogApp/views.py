from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import authenticate
from .models import Post, PostImage, Profile
from django.contrib.auth.models import User
from rest_framework import status
from .serializers import PostSerializer, UserSerializer, ImageUploadSerializer, ProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated
import re
# Create your views here.
count = 0
@api_view(['POST'])
def refreshtoken(request):
    refresh_token = request.data.get("refresh")
    if not refresh_token:
            return Response({"error": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
            refresh = RefreshToken(refresh_token)
            new_access_token = str(refresh.access_token)
            return Response({"access": new_access_token}, status=status.HTTP_200_OK)
    except TokenError:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    if user is None:
        return({"error":"User doesn't exist"})
    else:
        return Response({
        "id": user.id,
        "username": user.username,
        "pfp":request.build_absolute_uri(user.profile.pfp.url)
    })

@api_view(['POST'])
def register(request):
    global count
    count+=1
    serializer = UserSerializer(data =request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User created successfully!", "id":user.profile.id}, status=status.HTTP_201_CREATED)
    else:
        print("ERRORS:", serializer.errors)
        return Response(serializer.errors, status=400)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['GET'])
def home_page(request):
    posts = Post.objects.all().order_by('-created_at')
    serializer = PostSerializer(posts, many=True)  # convert queryset -> JSON
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def viewpost(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response({"error":"Post not found"}, status = status.HTTP_404_NOT_FOUND)
    
    serializer = PostSerializer(post)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_post(request):
    content = request.data.get("content")

    serializer = PostSerializer(data= request.data)  # convert queryset -> JSON
    if serializer.is_valid():
        serializer.save(author = request.user)
        image_urls = re.findall(r'src="([^"]+)"', content)
        for url in image_urls:
           PostImage.objects.filter(
           image=url.replace("http://127.0.0.1:8000/media/", "")
        ).update(used_in_post=True)
        unused_images = PostImage.objects.filter(used_in_post=False)
        for img in unused_images:
            img.image.delete()
            img.delete()

        return Response({"message": "Post created successfully!","datum":serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_postimage(request):
    files = request.FILES.getlist("images")
    if not files:
        return Response({"error": "No images provided."}, status=status.HTTP_400_BAD_REQUEST)

    saved_images = []
    
    for file in files:
        serializer = ImageUploadSerializer(data={"image":file})  # convert queryset -> JSON
        if serializer.is_valid():
            img = serializer.save()
            saved_images.append(request.build_absolute_uri(img.image.url))
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    return Response({"message": "Images Posted successfully!","urls":saved_images}, status=status.HTTP_201_CREATED)
    

@api_view(['GET','POST'])
@permission_classes([IsAuthenticated])
def editpost(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response({"error":"Post not found"}, status = status.HTTP_404_NOT_FOUND)
    if request.method == 'POST':
        serializer = PostSerializer(data= request.data, instance = post)  # convert queryset -> JSON
        if serializer.is_valid():
            serializer.save(edited = True)
            return Response({"message": "Post edited successfully!","datum":serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors)

    serializer = PostSerializer(post)
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deletepost(request, id):
    try:
        post = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return Response({"error":"Post not found"}, status = status.HTTP_404_NOT_FOUND)
    post.delete()
    return Response({"message":"post deleted"})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deleteUSER(request):
    password = request.data.get('password')
    if not request.user.check_password(password):
        return Response({"error": "Wrong password"}, status=400)

    request.user.delete()
    return Response({"message": "Account deleted successfully"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def viewprofile(request, username):
    try:
        profile = Profile.objects.get(user__username = username)
        posts = Post.objects.filter(author__username= username)
    except Profile.DoesNotExist:
        return Response({"error":"Profile not found"}, status = status.HTTP_404_NOT_FOUND)
    
    serializer = ProfileSerializer(profile)
    postserializer = PostSerializer(posts, many=True)
    return Response({"posts":postserializer.data,"profile":serializer.data})



@api_view(['GET','POST', 'DELETE'])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def editprofile(request):
    try:
        profile = Profile.objects.get(user = request.user)
    except Profile.DoesNotExist:
        return Response({"message":"Profile not found"}, status = status.HTTP_404_NOT_FOUND)
    if request.method == 'POST':
        serializer = ProfileSerializer(data= request.data, instance = profile)  # convert queryset -> JSON
       
        if serializer.is_valid():
            if (request.data.get('pfp')):
                profile = Profile.objects.get(user = request.user)
                if profile.pfp != 'pfp_images/vrsbd3nlv7cxqgn33tvc.svg':
                    profile.pfp.delete()
            serializer.save()
            return Response({"message": "Profile edited successfully!","user":
        {"id": request.user.id,
        "username": request.user.username,
        "pfp":request.build_absolute_uri(request.user.profile.pfp.url)}})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)#removed status cause it was preventing error message
    elif request.method == 'DELETE':
        profile = Profile.objects.get(user = request.user)
        profile.pfp.delete()
        profile.save()
        Profile.objects.filter(user = request.user).update(pfp='pfp_images/vrsbd3nlv7cxqgn33tvc.svg')
        

        return Response({"message": "Profile edited successfully!","user":
        {"id": request.user.id,
        "username": request.user.username,
        "pfp":request.build_absolute_uri(request.user.profile.pfp.url)}})
        

    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def createprofile(request,id):
        try:
            profile = Profile.objects.get(id=id)
        except Profile.DoesNotExist:
            return Response({"message":"Profile not found"}, status = status.HTTP_404_NOT_FOUND)
        serializer = ProfileSerializer(data= request.data, instance = profile)  # convert queryset -> JSON
       
        if serializer.is_valid():
            if (request.data.get('pfp')):
                profile = Profile.objects.get(id = id)
                if profile.pfp != 'pfp_images/vrsbd3nlv7cxqgn33tvc.svg':
                    profile.pfp.delete()
            serializer.save()
            return Response({"message": "Profile created successfully!"})
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)#removed status cause it was preventing error message

