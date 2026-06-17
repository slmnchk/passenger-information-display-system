package org.example.passengerinformationdisplaysystem.departures;

import jakarta.validation.Valid;
import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.example.passengerinformationdisplaysystem.departures.dto.JoinedDepartureDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/departures")
public class DepartureController {

    private final DepartureService service;

    public DepartureController(DepartureService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartureResponse> getDepartureById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getDepartureById(id));
    }

    @GetMapping
    public ResponseEntity<Page<JoinedDepartureDto>> getAllJoinedDepartures(
            @PageableDefault(size = 10, sort = "scheduledTime") Pageable pageable) {
        return ResponseEntity.ok(service.getAllJoinedDepartures(pageable));
    }

    @PostMapping
    public ResponseEntity<DepartureResponse> createDeparture(@Valid @RequestBody CreateDepartureRequest request) {
        DepartureResponse response = service.createDeparture(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartureById(@PathVariable Long id) {
        service.deleteDepartureById(id);
        return ResponseEntity.noContent().build();
    }

}