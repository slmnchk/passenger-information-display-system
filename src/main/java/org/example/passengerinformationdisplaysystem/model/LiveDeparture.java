package org.example.passengerinformationdisplaysystem.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalTime;

@Entity
@Table(name = "live_departures")
public class LiveDeparture {

    @Id
    private Integer tripId;

    private LocalTime actualTime;

    public LiveDeparture() {}

    public LiveDeparture(Integer tripId, LocalTime actualTime) {
        this.tripId = tripId;
        this.actualTime = actualTime;
    }

    public Integer getTripId() {
        return tripId;

    }
    public void setTripId(Integer tripId) {
        this.tripId = tripId;
    }

    public LocalTime getActualTime() {
        return actualTime;
    }

    public void setActualTime(LocalTime actualTime) {
        this.actualTime = actualTime;
    }
}