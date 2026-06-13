package org.example.passengerinformationdisplaysystem.controller;

import org.example.passengerinformationdisplaysystem.model.JoinedDeparture;
import org.example.passengerinformationdisplaysystem.model.LiveDeparture;
import org.example.passengerinformationdisplaysystem.model.LiveTimeDto;
import org.example.passengerinformationdisplaysystem.service.DepartureService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DepartureController {

    private final DepartureService departureService;

    private final Logger logger = LoggerFactory.getLogger(DepartureController.class);

    public DepartureController(DepartureService departureService) {
        this.departureService = departureService;
    }

    @GetMapping("/api/departures")
    public List<JoinedDeparture> getAllDepartures() {
        logger.info("Called: getAllDepartures");
        return departureService.getJoinedTable();
    }

    @GetMapping("/{id}")
    public List<JoinedDeparture> getDeparturesByCityId(
            @PathVariable("id") Integer id
    ) {
        logger.info("Called: getDeparturesByCityId with id: " + id);
        return departureService.getJoinedTableFilteredByCity(id);
    }

    @PostMapping("/{id}")
    public LiveDeparture createLiveDeparture(
            @PathVariable("id") Integer id,
            @RequestBody LiveTimeDto timeDto
    ) {
        logger.info("Called: createLiveDeparture for id: " + id);
        return departureService.createLiveDeparture(id, timeDto.actualTime());
    }

    @DeleteMapping("/{id}")
    public void deleteJoinedDeparture(
            @PathVariable("id") Integer id
    ) {
        logger.info("Called: deleteJoinedDeparture for id: " + id);
        departureService.deleteJoinedDeparture(id);
    }
}
