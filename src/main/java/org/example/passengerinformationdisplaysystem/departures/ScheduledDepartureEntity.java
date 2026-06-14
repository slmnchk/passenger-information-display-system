package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.*;

import java.time.Duration;
import java.time.LocalTime;

@Entity
@Table(name = "scheduled_departures")
public class ScheduledDepartureEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer tripId;

    @Column(name = "train_line")
    private String trainLine;

    @Column(name = "destination")
    private String destination;

    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(name = "delay")
    private Duration delay;

    public ScheduledDepartureEntity(){}
}
