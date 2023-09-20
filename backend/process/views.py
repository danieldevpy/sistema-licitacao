from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Process, CreationNotAllowedException
from .serializers import ProcessSerializer, ProcessSerializerPut
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from users.models import User


class PostListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user: User = request.user
        if user.is_staff:
            process = Process.objects.all()
        else:
            process = Process.objects.filter(sector=user.sector).all()
        
        serializer = ProcessSerializer(process, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        data = request.data
        data["_user"] = request.user.pk

        serializer = ProcessSerializer(data=data)
    
        if serializer.is_valid():
            try:
                serializer.save()
                response = serializer.data
                del response['_user']
            except CreationNotAllowedException as e:
                return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)
            return Response(response, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
     
class ProcessDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        process = get_object_or_404(Process, pk=pk)
        serializer = ProcessSerializer(process)
        response = serializer.data
        del response['_user']
        return Response(response)
    
    def put(self, request, pk):
        data = request.data
        data["_user"] = request.user.pk

        existing_process = get_object_or_404(Process, pk=pk)

        serializer = ProcessSerializer(existing_process, data=data)
        
        if serializer.is_valid():
            try:
                serializer.save()
                response = serializer.data
                del response['_user']
            except CreationNotAllowedException as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)