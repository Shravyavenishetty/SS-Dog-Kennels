from django.urls import path

from .consumers import PuppyUpdatesConsumer

websocket_urlpatterns = [
    path("ws/puppies/", PuppyUpdatesConsumer.as_asgi()),
]
