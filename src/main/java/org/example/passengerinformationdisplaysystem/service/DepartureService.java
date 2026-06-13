package org.example.passengerinformationdisplaysystem.service;

import org.example.passengerinformationdisplaysystem.model.LiveDeparture;
import org.example.passengerinformationdisplaysystem.model.StatusOfDeparture;
import org.example.passengerinformationdisplaysystem.repository.LiveDepartureRepository;
import org.springframework.stereotype.Service;
import org.example.passengerinformationdisplaysystem.model.JoinedDeparture;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class DepartureService {

    private final LiveDepartureRepository liveDepartureRepository;

    Map<Integer, List<JoinedDeparture>> departuresByCityId = new HashMap<>();


    public DepartureService(LiveDepartureRepository liveDepartureRepository) {
        this.liveDepartureRepository = liveDepartureRepository;
    }

    public LiveDeparture createLiveDeparture(Integer tripId, LocalTime actualTime) {
        LiveDeparture newLive = new LiveDeparture(tripId, actualTime);
        return liveDepartureRepository.save(newLive);
    }

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

    public void deleteJoinedDeparture(Integer id) {
        liveDepartureRepository.deleteById(id);
    }
}
