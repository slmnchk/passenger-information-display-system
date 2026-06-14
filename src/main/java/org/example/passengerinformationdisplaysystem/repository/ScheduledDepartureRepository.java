package org.example.passengerinformationdisplaysystem.repository;

import org.example.passengerinformationdisplaysystem.model.ScheduledDeparture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScheduledDepartureRepository extends JpaRepository<ScheduledDeparture, Integer> {
}