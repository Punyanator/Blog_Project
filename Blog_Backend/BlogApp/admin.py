from django.contrib import admin
from .models import Post, PostImage, Profile


#class UserAdmin(admin.ModelAdmin):
 #   list_display =['username', 'email']

#class ProfileAdmin(admin.ModelAdmin):
 #   list_editable =['verify']
 #   list_display = ['user', 'full_name', 'verified']


# Register your models here.
admin.site.register(Post)
admin.site.register(PostImage)
admin.site.register(Profile)
