package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "scheduled_departures")
public class ScheduledDepartureEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "train_line", nullable = false)
    private String trainLine;

    @Column(name = "destination", nullable = false)
    private String destination;

    @Column(name = "scheduled_time", nullable = false)
    private LocalTime scheduledTime;

    @OneToOne(mappedBy = "scheduledDeparture", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private LiveDepartureEntity liveDeparture;

    public ScheduledDepartureEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTrainLine() { return trainLine; }
    public void setTrainLine(String trainLine) { this.trainLine = trainLine; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public LocalTime getScheduledTime() { return scheduledTime; }
    public void setScheduledTime(LocalTime scheduledTime) { this.scheduledTime = scheduledTime; }

    public LiveDepartureEntity getLiveDeparture() { return liveDeparture; }
    public void setLiveDeparture(LiveDepartureEntity liveDeparture) { this.liveDeparture = liveDeparture; }
}