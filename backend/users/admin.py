from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

class CustomUserAdmin(UserAdmin):
    # Campos a serem exibidos na lista de usuários na interface de admin
    list_display = ('username', 'sector', 'is_staff')

    # Campos que podem ser utilizados para pesquisar usuários
    search_fields = ('username', 'first_name', 'last_name', 'email')

    # Campos a serem exibidos na página de detalhes de usuário
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'sector')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Campos para adicionar um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
    )

admin.site.register(User, CustomUserAdmin)
