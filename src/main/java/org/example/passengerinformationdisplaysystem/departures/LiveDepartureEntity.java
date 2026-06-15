package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "live_departures")
public class LiveDepartureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "actual_time", nullable = false)
    private LocalTime actualTime;

    public LiveDepartureEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalTime getActualTime() { return actualTime; }
    public void setActualTime(LocalTime scheduledTime) { this.actualTime = actualTime; }
}