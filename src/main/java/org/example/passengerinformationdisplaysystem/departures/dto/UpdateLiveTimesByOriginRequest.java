package org.example.passengerinformationdisplaysystem.departures.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalTime;

public record UpdateLiveTimesByOriginRequest(
        @NotBlank @Size(max = 255) String origin,
        @NotNull LocalTime actualTime
) {}
