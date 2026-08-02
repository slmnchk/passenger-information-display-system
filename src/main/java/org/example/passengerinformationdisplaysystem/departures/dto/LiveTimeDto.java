package org.example.passengerinformationdisplaysystem.departures.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalTime;

public record LiveTimeDto(
        @NotNull(message = "Actual time is required") LocalTime actualTime
) {

}
