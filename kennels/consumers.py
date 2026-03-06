import json

from channels.generic.websocket import AsyncWebsocketConsumer


class PuppyUpdatesConsumer(AsyncWebsocketConsumer):
    group_name = "puppies_updates"

    async def connect(self):
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
        await self.send(
            text_data=json.dumps(
                {
                    "event": "connected",
                    "stream": "puppies",
                }
            )
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def puppies_update(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "event": "puppies.update",
                    "payload": event.get("payload", {}),
                }
            )
        )
