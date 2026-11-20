package org.example.passengerinformationdisplaysystem.departures;

import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.example.passengerinformationdisplaysystem.departures.dto.JoinedDepartureDto;
import org.example.passengerinformationdisplaysystem.departures.dto.LiveTimeDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalTime;
import java.util.List;
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
        return createDepartures(List.of(request)).getFirst();
    }

    @Transactional
    public List<DepartureResponse> createDepartures(List<CreateDepartureRequest> requests) {
        List<ScheduledDepartureEntity> departures = requests.stream().map(mapper::toEntity).toList();
        for (ScheduledDepartureEntity departure : departures) {
            if (departure.getOrigin() == null && departure.getDestination().isEmpty()) {
                throw new IllegalArgumentException("Each departure needs an origin or a destination");
            }
        }
        return repository.saveAll(departures).stream().map(mapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DepartureResponse getDepartureById(Long id) {
        ScheduledDepartureEntity entity = repository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Departure with ID " + id + " not found"));
        return mapper.toResponse(entity);
    }


    @Transactional
    public void deleteDepartureById(Long id) {
        repository.findScheduledDepartureById(id).ifPresent(repository::delete);
    }

    @Transactional
    public int deleteDeparturesAfterId(long idGreaterThan) {
        List<ScheduledDepartureEntity> departures = repository.findByIdGreaterThanOrderById(idGreaterThan);
        repository.deleteAll(departures);
        return departures.size();
    }

    @Transactional(readOnly = true)
    public Page<JoinedDepartureDto> getAllJoinedDepartures(Pageable pageable, String origin, Long idGreaterThan) {
        Specification<ScheduledDepartureEntity> filter = Specification.unrestricted();
        if (origin != null) {
            String station = origin.strip();
            filter = filter.and((root, query, cb) -> cb.equal(
                    cb.upper(root.get("origin")), cb.upper(cb.literal(station))));
        }
        if (idGreaterThan != null) {
            filter = filter.and((root, query, cb) -> cb.gt(root.get("id"), idGreaterThan));
        }
        Page<ScheduledDepartureEntity> scheduledPage = repository.findAll(filter, pageable);

        return scheduledPage.map(entity -> {
            LocalTime actual = (entity.getLiveDeparture() != null)
                    ? entity.getLiveDeparture().getActualTime()
                    : entity.getScheduledTime();

            long delay = Duration.between(entity.getScheduledTime(), actual).toMinutes();

            StatusOfDeparture status = calculateStatus(delay);

            return new JoinedDepartureDto(
                    entity.getId(),
                    entity.getTrainLine(),
                    entity.getDestination(),
                    entity.getScheduledTime(),
                    actual,
                    delay,
                    status,
                    entity.getOrigin(),
                    entity.getPlatform()
            );
        });
    }

    @Transactional
    public void updateLiveTime(Long id, LiveTimeDto request) {
        ScheduledDepartureEntity entity = repository.findScheduledDepartureById(id)
                .orElseThrow(() -> new NoSuchElementException("Departure with ID " + id + " not found"));
        setActualTime(entity, request.actualTime());
    }

    @Transactional
    public int updateLiveTimesByOrigin(String origin, LocalTime actualTime) {
        List<ScheduledDepartureEntity> departures = repository.findByOriginIgnoreCaseOrderById(origin.strip());
        departures.forEach(departure -> setActualTime(departure, actualTime));
        return departures.size();
    }

    private void setActualTime(ScheduledDepartureEntity entity, LocalTime actualTime) {
        LiveDepartureEntity liveDeparture = entity.getLiveDeparture();
        if (liveDeparture == null) {
            liveDeparture = new LiveDepartureEntity();
            liveDeparture.setScheduledDeparture(entity);
            entity.setLiveDeparture(liveDeparture);
        }
        liveDeparture.setActualTime(actualTime);
        repository.save(entity);
    }

    private StatusOfDeparture calculateStatus(long delayMinutes) {
        if (delayMinutes >= 600) return StatusOfDeparture.DELAYED_BY_600_MINUTES;
        if (delayMinutes >= 60)  return StatusOfDeparture.DELAYED_BY_60_MINUTES;
        if (delayMinutes >= 45)  return StatusOfDeparture.DELAYED_BY_45_MINUTES;
        if (delayMinutes >= 30)  return StatusOfDeparture.DELAYED_BY_30_MINUTES;
        if (delayMinutes >= 15)  return StatusOfDeparture.DELAYED_BY_15_MINUTES;
        if (delayMinutes >= 5)   return StatusOfDeparture.DELAYED_BY_5_MINUTES;
        return StatusOfDeparture.ON_TIME;
    }
}
