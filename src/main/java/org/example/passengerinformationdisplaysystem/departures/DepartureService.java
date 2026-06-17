package org.example.passengerinformationdisplaysystem.departures;

import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.jspecify.annotations.Nullable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
public class DepartureService {

    private final ScheduledDepartureRepository repository;
    private final DepartureMapper mapper;

    public DepartureService(ScheduledDepartureRepository repository, DepartureMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public Page<DepartureResponse> getAllDepartures(Pageable pageable) {
        return repository.findAll(pageable).map(mapper::toResponse);
    }

    @Transactional
    public DepartureResponse createDeparture(CreateDepartureRequest request) {
        ScheduledDepartureEntity entity = mapper.toEntity(request);
        ScheduledDepartureEntity savedEntity = repository.save(entity);
        return mapper.toResponse(savedEntity);
    }

    @Transactional(readOnly = true)
    public DepartureResponse getDepartureById(Long id) {
        ScheduledDepartureEntity entity = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Departure with ID " + id + " not found"));
        return mapper.toResponse(entity);
    }


    public void deleteDepartureById(Long id) {
        repository.deleteById(id);
    }
}