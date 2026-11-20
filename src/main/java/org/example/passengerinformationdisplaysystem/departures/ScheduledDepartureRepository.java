package org.example.passengerinformationdisplaysystem.departures;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScheduledDepartureRepository extends JpaRepository<ScheduledDepartureEntity, Long>,
        JpaSpecificationExecutor<ScheduledDepartureEntity> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<ScheduledDepartureEntity> findScheduledDepartureById(Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<ScheduledDepartureEntity> findByOriginIgnoreCaseOrderById(String origin);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<ScheduledDepartureEntity> findByIdGreaterThanOrderById(long id);
}
