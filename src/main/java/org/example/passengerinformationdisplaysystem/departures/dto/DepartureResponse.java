package org.example.passengerinformationdisplaysystem.departures.dto;

import java.time.LocalTime;

public record DepartureResponse(
        Long id,
        String trainLine,
        String destination,
        LocalTime scheduledTime
) {}