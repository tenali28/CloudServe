from fastapi import FastAPI, HTTPException

from database import get_connection, initialize_database
from schemas import RequestCreate, RequestUpdate


app = FastAPI(
    title="CloudServe API",
    description="Cloud-based Service Request and Incident Management Platform",
    version="1.0.0"
)


@app.on_event("startup")
def startup():
    initialize_database()


@app.get("/")
def home():
    return {
        "application": "CloudServe",
        "status": "running",
        "message": "CloudServe API is operational"
    }


def calculate_priority(category, description):
    text = (category + " " + description).lower()

    critical_words = [
        "network down",
        "server down",
        "security breach",
        "entire department"
    ]

    high_words = [
        "cannot access",
        "not working",
        "urgent",
        "failure"
    ]

    for word in critical_words:
        if word in text:
            return "CRITICAL"

    for word in high_words:
        if word in text:
            return "HIGH"

    return "LOW"


@app.post("/requests")
def create_request(request: RequestCreate):

    priority = calculate_priority(
        request.category,
        request.description
    )

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO requests
        (
            title,
            description,
            category,
            priority,
            status,
            requester
        )
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            request.title,
            request.description,
            request.category,
            priority,
            "OPEN",
            request.requester
        )
    )

    connection.commit()

    request_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Service request created successfully",
        "request_id": request_id,
        "priority": priority,
        "status": "OPEN"
    }


@app.get("/requests")
def get_requests():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT *
        FROM requests
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    return [dict(row) for row in rows]


@app.get("/requests/{request_id}")
def get_request(request_id: int):

    connection = get_connection()

    row = connection.execute(
        """
        SELECT *
        FROM requests
        WHERE id = ?
        """,
        (request_id,)
    ).fetchone()

    connection.close()

    if row is None:
        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    return dict(row)


@app.put("/requests/{request_id}")
def update_request(
    request_id: int,
    request: RequestUpdate
):

    connection = get_connection()

    existing_request = connection.execute(
        """
        SELECT *
        FROM requests
        WHERE id = ?
        """,
        (request_id,)
    ).fetchone()

    if existing_request is None:
        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Service request not found"
        )

    priority = (
        request.priority
        if request.priority is not None
        else existing_request["priority"]
    )

    status = (
        request.status
        if request.status is not None
        else existing_request["status"]
    )

    assigned_team = (
        request.assigned_team
        if request.assigned_team is not None
        else existing_request["assigned_team"]
    )

    valid_priorities = [
        "LOW",
        "HIGH",
        "CRITICAL"
    ]

    valid_statuses = [
        "OPEN",
        "ASSIGNED",
        "IN_PROGRESS",
        "RESOLVED",
        "CLOSED"
    ]

    if priority not in valid_priorities:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Invalid priority"
        )

    if status not in valid_statuses:
        connection.close()

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    connection.execute(
        """
        UPDATE requests
        SET
            priority = ?,
            status = ?,
            assigned_team = ?
        WHERE id = ?
        """,
        (
            priority,
            status,
            assigned_team,
            request_id
        )
    )

    connection.commit()

    connection.close()

    return {
        "message": "Service request updated successfully",
        "request_id": request_id,
        "priority": priority,
        "status": status,
        "assigned_team": assigned_team
    }