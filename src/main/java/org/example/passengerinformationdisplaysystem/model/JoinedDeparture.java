package org.example.passengerinformationdisplaysystem.model;

import java.time.Duration;
import java.time.LocalTime;

public record JoinedDeparture(
        Integer tripId,
        String trainLine,
        String destination,
        LocalTime scheduledTime,
        LocalTime actualTime,
        Duration delay,
        StatusOfDeparture statusOfDeparture
) {}
