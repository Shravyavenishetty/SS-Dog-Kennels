from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Puppy, PuppyImage


def broadcast_puppies_update(action, model_name, instance_id):
    channel_layer = get_channel_layer()
    if not channel_layer:
        return

    async_to_sync(channel_layer.group_send)(
        "puppies_updates",
        {
            "type": "puppies.update",
            "payload": {
                "action": action,
                "model": model_name,
                "id": str(instance_id),
                "timestamp": timezone.now().isoformat(),
            },
        },
    )


@receiver(post_save, sender=Puppy)
def puppy_saved(sender, instance, created, **kwargs):
    broadcast_puppies_update(
        action="created" if created else "updated",
        model_name="puppy",
        instance_id=instance.pk,
    )


@receiver(post_delete, sender=Puppy)
def puppy_deleted(sender, instance, **kwargs):
    broadcast_puppies_update(
        action="deleted",
        model_name="puppy",
        instance_id=instance.pk,
    )


@receiver(post_save, sender=PuppyImage)
def puppy_image_saved(sender, instance, created, **kwargs):
    broadcast_puppies_update(
        action="created" if created else "updated",
        model_name="puppy_image",
        instance_id=instance.pk,
    )


@receiver(post_delete, sender=PuppyImage)
def puppy_image_deleted(sender, instance, **kwargs):
    broadcast_puppies_update(
        action="deleted",
        model_name="puppy_image",
        instance_id=instance.pk,
    )
