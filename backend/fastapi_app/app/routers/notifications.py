
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user

router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"],
)

@router.get("/", response_model=List[schemas.Notification])
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    notifications = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).options(
        joinedload(models.Notification.from_user)
    ).order_by(
        models.Notification.created_at.desc()
    ).all()
    
    # Add link field
    for notification in notifications:
        if notification.discussion_id:
            if notification.comment_id:
                notification.link = f"/discussions/{notification.discussion_id}#comment-{notification.comment_id}"
            else:
                notification.link = f"/discussions/{notification.discussion_id}"
    
    return notifications

@router.post("/{notification_id}/read", status_code=status.HTTP_200_OK)
async def mark_notification_as_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    notification = db.query(models.Notification).filter(
        models.Notification.id == notification_id,
        models.Notification.user_id == current_user.id
    ).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"status": "success"}

@router.post("/read-all", status_code=status.HTTP_200_OK)
async def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"status": "success"}
