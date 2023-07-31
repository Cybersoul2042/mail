from django.contrib import admin

from .models import Email, User

# Register your models here.
class EmailAdmin(admin.ModelAdmin):
    email_list = ("user","sender","recipients","subject","body","timestamp")

class UserAdmin(admin.ModelAdmin):
    user_list = ("email", "password")

admin.site.register(Email, EmailAdmin)
admin.site.register(User, UserAdmin)