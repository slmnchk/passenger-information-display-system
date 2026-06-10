package org.example.passengerinformationdisplaysystem.service;

import org.example.passengerinformationdisplaysystem.model.StatusOfDeparture;
import org.springframework.stereotype.Service;
import org.example.passengerinformationdisplaysystem.model.JoinedDeparture;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class DepartureService {

    Map<Integer, List<JoinedDeparture>> departuresByCityId = new HashMap<>();

    public List<JoinedDeparture> getJoinedTable() {
        return List.of(new JoinedDeparture(
                1, "1", "1", null, null, null, StatusOfDeparture.ON_TIME)
        ); // TODO: add a logic or/and real data
    }

    public List<JoinedDeparture> getJoinedTableFilteredByCity(Integer cityId) {
        if(!departuresByCityId.containsKey(cityId)){
            throw new NoSuchElementException("City with id " + cityId + " not found");
        }
        return getJoinedTable(); // TODO: later should be filtered by city
    }
}
