from django.urls import path
from . import views   # import your views here

urlpatterns = [
   path( 'posts/', views.home_page, name='home'),
   path("posts/<int:id>/", views.viewpost, name='post'),
   path("posts/create/", views.create_post, name='post_create'),
   path("posts/delete/<int:id>/", views.deletepost, name='post_delete'),
   path("posts/edit/<int:id>/", views.editpost, name='post_edit'),
   path("register/", views.register, name='register'),
   path("login/", views.login, name='login'),
   path("user/", views.get_user, name='user'),
   path("user/delete/", views.deleteUSER, name='userdelete'),
   path("refresh/", views.refreshtoken, name='refresh'),
   path("upload-image/", views.create_postimage, name='postimage'),
    path("profile/<str:username>", views.viewprofile, name='profile'),
    path("profile/edit/", views.editprofile, name='profile_edit'),
    path("profile/create/<int:id>/", views.createprofile, name='profile_edit'),

]
