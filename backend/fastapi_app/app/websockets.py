from fastapi import WebSocket, WebSocketDisconnect, Depends, HTTPException
from typing import Dict, List, Optional, Any
import json
import asyncio
from uuid import UUID
from .dependencies import get_current_user_ws
from . import schemas

# Connection manager for WebSockets
class ConnectionManager:
    def __init__(self):
        # user_id -> List[WebSocket]
        self.active_connections: Dict[UUID, List[WebSocket]] = {}
        # WebSocket -> user_id
        self.connection_user: Dict[WebSocket, UUID] = {}

    async def connect(self, websocket: WebSocket, user_id: UUID):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        self.connection_user[websocket] = user_id
        
        # Send a welcome message
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to WebSocket server"
        })

    def disconnect(self, websocket: WebSocket):
        user_id = self.connection_user.get(websocket)
        if user_id:
            connections = self.active_connections.get(user_id, [])
            if websocket in connections:
                connections.remove(websocket)
            if not connections:
                self.active_connections.pop(user_id, None)
            self.connection_user.pop(websocket, None)

    async def send_personal_message(self, message: Dict[str, Any], user_id: UUID):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                await connection.send_json(message)

    async def broadcast(self, message: Dict[str, Any]):
        for connections in self.active_connections.values():
            for connection in connections:
                await connection.send_json(message)

    async def broadcast_to_users(self, message: Dict[str, Any], user_ids: List[UUID]):
        for user_id in user_ids:
            await self.send_personal_message(message, user_id)


# Create a connection manager instance
manager = ConnectionManager()

# WebSocket endpoint
async def websocket_endpoint(websocket: WebSocket, user: schemas.User = Depends(get_current_user_ws)):
    await manager.connect(websocket, user.id)
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_text()
            
            # Process the message (optional)
            try:
                message_data = json.loads(data)
                # Handle different message types here if needed
            except json.JSONDecodeError:
                pass
            
            # Echo the message back (for testing)
            await websocket.send_text(f"Message received: {data}")
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
