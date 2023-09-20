from django.contrib import admin
from .models import Process

class ProcessAdmin(admin.ModelAdmin):
    fields = ('process_number', 'object', 'sector', 'status', 'active')  

    def save_model(self, request, obj, form, change):
        # Define o usuário atual como o criador do objeto
      
        user = request.user
        
        obj._user = user
        # Chama o save_model no admin pai para salvar o objeto
        super().save_model(request, obj, form, change)

# Registra o modelo e o admin
admin.site.register(Process, ProcessAdmin)
