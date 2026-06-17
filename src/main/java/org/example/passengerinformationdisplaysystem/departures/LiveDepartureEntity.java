package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "live_departures")
public class LiveDepartureEntity {

    @Id
    private Long id;

    private LocalTime actualTime;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private ScheduledDepartureEntity scheduledDeparture;

    public LiveDepartureEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalTime getActualTime() { return actualTime; }
    public ScheduledDepartureEntity getScheduledDeparture() { return scheduledDeparture; }
    public void setScheduledDeparture(ScheduledDepartureEntity scheduledDeparture) { this.scheduledDeparture = scheduledDeparture; }
}