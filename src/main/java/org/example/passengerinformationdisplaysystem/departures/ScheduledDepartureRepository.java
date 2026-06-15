package org.example.passengerinformationdisplaysystem.departures;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduledDepartureRepository extends JpaRepository<ScheduledDepartureEntity, Long> {
}