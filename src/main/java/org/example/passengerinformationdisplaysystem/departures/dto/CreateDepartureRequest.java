package org.example.passengerinformationdisplaysystem.departures.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalTime;

public record CreateDepartureRequest(
        @Size(max = 255) String trainLine,
        @Size(max = 255) String destination,
        @NotNull(message = "Scheduled time is required")
        LocalTime scheduledTime,
        @Size(max = 255) String origin,
        @Size(max = 255) String platform
) {}
