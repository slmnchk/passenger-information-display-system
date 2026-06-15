package org.example.passengerinformationdisplaysystem.departures.dto;

import java.time.LocalTime;

public record UpdateDelayRequest(
        Long id,
        LocalTime actualTime
) {}
