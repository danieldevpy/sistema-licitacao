from django.urls import path
from dispatch import views

urlpatterns = [
    path('process/<int:pk>', views.DispatchListView.as_view())
]
