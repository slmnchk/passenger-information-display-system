package org.example.passengerinformationdisplaysystem.departures;

import jakarta.validation.Valid;
import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.example.passengerinformationdisplaysystem.departures.dto.JoinedDepartureDto;
import org.example.passengerinformationdisplaysystem.departures.dto.LiveTimeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalTime;
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
    public Page<DepartureResponse> getAllScheduledDepartures(Pageable pageable) {
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

    @Transactional(readOnly = true)
    public Page<JoinedDepartureDto> getAllJoinedDepartures(Pageable pageable) {
        Page<ScheduledDepartureEntity> scheduledPage = repository.findAll(pageable);

        return scheduledPage.map(entity -> {
            LocalTime actual = (entity.getLiveDeparture() != null)
                    ? entity.getLiveDeparture().getActualTime()
                    : entity.getScheduledTime();

            Duration delay = Duration.between(entity.getScheduledTime(), actual);

            StatusOfDeparture status = calculateStatus(delay.toMinutes());

            return new JoinedDepartureDto(
                    entity.getId(),
                    entity.getTrainLine(),
                    entity.getDestination(),
                    entity.getScheduledTime(),
                    actual,
                    delay,
                    status
            );
        });
    }
    public void updateLiveTime(Long id, @Valid LiveTimeDto request) {
        ScheduledDepartureEntity entity = repository.findById(id)
                .orElseThrow(()-> new NoSuchElementException("Departure not found"));
        LiveDepartureEntity liveDeparture = entity.getLiveDeparture();
        if (liveDeparture == null) {
            liveDeparture = new LiveDepartureEntity();
            liveDeparture.setScheduledDeparture(entity);
            entity.setLiveDeparture(liveDeparture);
        }
        liveDeparture.setActualTime(request.actualTime());
        repository.save(entity);
    }

    private StatusOfDeparture calculateStatus(long delayMinutes) {
        if (delayMinutes >= 600) return StatusOfDeparture.DALAYED_BY_600_MINUTES;
        if (delayMinutes >= 60)  return StatusOfDeparture.DELAYED_BY_60_MINUTES;
        if (delayMinutes >= 45)  return StatusOfDeparture.DELAYED_BY_45_MINUTES;
        if (delayMinutes >= 30)  return StatusOfDeparture.DELAYED_BY_30_MINUTES;
        if (delayMinutes >= 15)  return StatusOfDeparture.DELAYED_BY_15_MINUTES;
        if (delayMinutes >= 5)   return StatusOfDeparture.DELAYED_BY_5_MINUTES;
        return StatusOfDeparture.ON_TIME;
    }
}