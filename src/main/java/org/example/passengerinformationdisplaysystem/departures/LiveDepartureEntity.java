package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(name = "live_departures")
public class LiveDepartureEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer tripId;

    @Column(name = "actual_time")
    private LocalTime actualTime;

    public LiveDepartureEntity() {}

    public LiveDepartureEntity(Integer tripId, LocalTime actualTime) {
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