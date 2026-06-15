package org.example.passengerinformationdisplaysystem.departures;

import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.springframework.stereotype.Component;

@Component
public class DepartureMapper {

    public ScheduledDepartureEntity toEntity(CreateDepartureRequest request) {
        ScheduledDepartureEntity entity = new ScheduledDepartureEntity();
        entity.setTrainLine(request.trainLine());
        entity.setDestination(request.destination());
        entity.setScheduledTime(request.scheduledTime());
        return entity;
    }

    public DepartureResponse toResponse(ScheduledDepartureEntity entity) {
        return new DepartureResponse(
                entity.getId(),
                entity.getTrainLine(),
                entity.getDestination(),
                entity.getScheduledTime()
        );
    }
}