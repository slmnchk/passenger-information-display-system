package org.example.passengerinformationdisplaysystem.departures;

import org.springframework.stereotype.Service;
import org.example.passengerinformationdisplaysystem.departures.dto.JoinedDepartureDto;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class DepartureService {

    private final LiveDepartureRepository liveDepartureRepository;

    Map<Integer, List<JoinedDepartureDto>> departuresByCityId = new HashMap<>();


    public DepartureService(LiveDepartureRepository liveDepartureRepository) {
        this.liveDepartureRepository = liveDepartureRepository;
    }

    public LiveDepartureEntity createLiveDeparture(Integer tripId, LocalTime actualTime) {
        LiveDepartureEntity newLive = new LiveDepartureEntity(tripId, actualTime);
        return liveDepartureRepository.save(newLive);
    }

    public List<JoinedDepartureDto> getJoinedTable() {
        return List.of(new JoinedDepartureDto(
                1, "1", "1", null, null, null, StatusOfDeparture.ON_TIME)
        ); // TODO: add a logic or/and real data
    }

    public List<JoinedDepartureDto> getJoinedTableFilteredByCity(Integer cityId) {
        if(!departuresByCityId.containsKey(cityId)){
            throw new NoSuchElementException("City with id " + cityId + " not found");
        }
        return getJoinedTable(); // TODO: later should be filtered by city
    }

    public void deleteJoinedDeparture(Integer id) {
        liveDepartureRepository.deleteById(id);
    }
}
