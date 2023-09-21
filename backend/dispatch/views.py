from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from django.shortcuts import get_object_or_404
from process.models import Process
from .serializers import DispatchSerializer
from .models import Dispatch

# Create your views here.
class DispatchListView(APIView):
    authentication_classes = [JWTAuthentication]

    def get(self, request, pk):
        process = get_object_or_404(Process, pk=pk)
        dispatchs = Dispatch.objects.filter(process=process).all()
        print(dispatchs)
        serializer = DispatchSerializer(dispatchs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)