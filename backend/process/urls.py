from django.urls import path
from process import views

urlpatterns = [
    path('', views.PostListView.as_view()),
    path('/<int:pk>', views.ProcessDetailView.as_view())
]
