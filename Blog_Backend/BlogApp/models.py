from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content= models.TextField()
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    edited = models.BooleanField(default=False)

    class Meta:
        unique_together = ['author', 'title']


    def __str__(self):
        return self.title

class PostImage(models.Model):
    image = models.ImageField(upload_to="post_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    used_in_post =  models.BooleanField(default=False)

    def __str__(self):
        return str(self.image.name)
    

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=300)
    bio = models.CharField(max_length=300,blank=True)
    pfp = models.ImageField(default="pfp_images//vrsbd3nlv7cxqgn33tvc.svg", upload_to="pfp_images")
    verified = models.BooleanField(default=False)


    def _str_(self):
        return self.full_name
    

