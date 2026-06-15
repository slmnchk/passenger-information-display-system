package org.example.passengerinformationdisplaysystem.departures.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

public record CreateDepartureRequest(
        @NotBlank(message = "Train line cannot be empty")
        String trainLine,

        @NotBlank(message = "Destination cannot be empty")
        String destination,

        @NotNull(message = "Scheduled time is required")
        LocalTime scheduledTime
) {}