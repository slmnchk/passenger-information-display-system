package org.example.passengerinformationdisplaysystem.repository;

import org.example.passengerinformationdisplaysystem.model.LiveDeparture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LiveDepartureRepository extends JpaRepository<LiveDeparture, Integer> {
}