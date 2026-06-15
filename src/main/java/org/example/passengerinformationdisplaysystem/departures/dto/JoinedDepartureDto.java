package org.example.passengerinformationdisplaysystem.departures.dto;

import org.example.passengerinformationdisplaysystem.departures.StatusOfDeparture;

import java.time.Duration;
import java.time.LocalTime;

public record JoinedDepartureDto(
        Long tripId,
        String trainLine,
        String destination,
        LocalTime scheduledTime,
        LocalTime actualTime,
        Duration delay,
        StatusOfDeparture statusOfDeparture
) {}
