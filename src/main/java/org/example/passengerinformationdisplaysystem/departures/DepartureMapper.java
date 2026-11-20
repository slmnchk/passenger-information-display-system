package org.example.passengerinformationdisplaysystem.departures;

import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class DepartureMapper {

    public ScheduledDepartureEntity toEntity(CreateDepartureRequest request) {
        ScheduledDepartureEntity entity = new ScheduledDepartureEntity();
        entity.setTrainLine(request.trainLine() == null ? "" : request.trainLine().strip());
        entity.setDestination(request.destination() == null ? "" : request.destination().strip());
        entity.setScheduledTime(request.scheduledTime());
        entity.setOrigin(StringUtils.hasText(request.origin()) ? request.origin().strip() : null);
        entity.setPlatform(StringUtils.hasText(request.platform()) ? request.platform().strip() : null);
        return entity;
    }

    public DepartureResponse toResponse(ScheduledDepartureEntity entity) {
        return new DepartureResponse(
                entity.getId(),
                entity.getTrainLine(),
                entity.getDestination(),
                entity.getScheduledTime(),
                entity.getOrigin(),
                entity.getPlatform()
        );
    }
}
