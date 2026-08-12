from pydantic import BaseModel


class RequestCreate(BaseModel):
    title: str
    description: str
    category: str
    requester: str


class RequestUpdate(BaseModel):
    priority: str | None = None
    status: str | None = None
    assigned_team: str | None = None