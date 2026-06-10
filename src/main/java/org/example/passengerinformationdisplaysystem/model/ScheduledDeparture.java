package org.example.passengerinformationdisplaysystem.model;

import java.time.Duration;
import java.time.LocalTime;

public class ScheduledDeparture {
    private Integer tripId;
    private String trainLine;
    private String destination;
    private LocalTime scheduledTime;
    private Duration delay;

    public ScheduledDeparture(){}
}
