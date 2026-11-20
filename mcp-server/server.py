import os
from typing import Annotated

import httpx
from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from pydantic import BaseModel, Field

mcp = FastMCP("Passenger Information Display System")
api_url = os.environ.get("PIDS_API_URL", "http://localhost:3000/api")

ClockTime = Annotated[str, Field(pattern=r"^(?:[01]\d|2[0-3]):[0-5]\d$")]
DepartureId = Annotated[int, Field(ge=1, le=2**63 - 1)]
IdThreshold = Annotated[int, Field(ge=0, le=2**63 - 1)]
Origin = Annotated[str, Field(min_length=1, max_length=255)]


class NewDeparture(BaseModel):
    scheduledTime: ClockTime
    origin: Origin | None = None
    platform: str | None = Field(default=None, max_length=255, description="Platform, e.g. Gleis 2")
    trainLine: str | None = Field(default=None, max_length=255)
    destination: str | None = Field(default=None, max_length=255)


async def request(method: str, path: str, **kwargs):
    try:
        async with httpx.AsyncClient(base_url=api_url, timeout=10) as client:
            response = await client.request(method, path, **kwargs)
            response.raise_for_status()
    except httpx.HTTPStatusError as exc:
        status = exc.response.status_code
        try:
            message = exc.response.json().get("message")
        except (ValueError, AttributeError):
            message = None
        raise ToolError(f"Departure API returned HTTP {status}: {message or exc.response.reason_phrase}") from exc
    except httpx.RequestError as exc:
        raise ToolError(f"Departure API request to {api_url} failed: {exc}") from exc

    return response.json() if response.content else None


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": False})
async def list_departures(
    origin: Origin | None = None,
    id_greater_than: IdThreshold | None = None,
    page: Annotated[int, Field(ge=0)] = 0,
    size: Annotated[int, Field(ge=1, le=100)] = 20,
) -> dict:
    """List departures with scheduled and expected times. Origin is an exact, case-insensitive station name.

    Use id_greater_than to preview departures with IDs strictly above a threshold.
    Pages are zero-indexed. Use totalPages to determine whether to fetch more.
    """
    filters = {"origin": origin, "idGreaterThan": id_greater_than, "page": page, "size": size}
    return await request("GET", "/departures", params={key: value for key, value in filters.items() if value is not None})


@mcp.tool(annotations={"readOnlyHint": True, "openWorldHint": False})
async def get_departure(id: DepartureId) -> dict:
    """Get the scheduled details of one departure by ID."""
    return await request("GET", f"/departures/{id}")


@mcp.tool(annotations={"destructiveHint": False, "openWorldHint": False})
async def create_departures(departures: Annotated[list[NewDeparture], Field(min_length=1, max_length=100)]) -> dict:
    """Create one or more departures in a single transaction. Each row needs an origin or a destination.

    Use scheduledTime in 24-hour HH:MM format. Leave unknown train lines and destinations blank.
    """
    created = await request("POST", "/departures/batch", json={
        "departures": [departure.model_dump(exclude_none=True) for departure in departures]
    })
    return {"count": len(created), "departures": created}


@mcp.tool(annotations={"destructiveHint": True, "openWorldHint": False})
async def set_live_departure_time(id: DepartureId, actual_time: ClockTime) -> dict:
    """Set the expected departure time (HH:MM) of a single departure by ID."""
    await request("POST", f"/departures/{id}/live", json={"actualTime": actual_time})
    return {"id": id, "actualTime": actual_time}


@mcp.tool(annotations={"destructiveHint": True, "openWorldHint": False})
async def set_live_times_by_origin(origin: Origin, actual_time: ClockTime) -> dict:
    """Set the same expected departure time (HH:MM) for every departure from an exact, case-insensitive origin.

    Ask for the desired time if the user did not specify one. For a different time per departure,
    list that origin's departures and update each ID individually.
    """
    return await request("PATCH", "/departures/live", json={"origin": origin, "actualTime": actual_time})


@mcp.tool(annotations={"destructiveHint": True, "openWorldHint": False})
async def delete_departure(id: DepartureId) -> dict:
    """Delete one departure by ID. A repeated deletion leaves it absent."""
    await request("DELETE", f"/departures/{id}")
    return {"id": id, "present": False}


@mcp.tool(annotations={"destructiveHint": True, "openWorldHint": False})
async def delete_departures_after_id(id_greater_than: IdThreshold) -> dict:
    """Delete every departure with an ID strictly greater than the given threshold.

    Use list_departures with the same threshold if the user asks to preview the selection.
    """
    return await request("DELETE", "/departures", params={"idGreaterThan": id_greater_than})


if __name__ == "__main__":
    mcp.run(transport="stdio", show_banner=False)
