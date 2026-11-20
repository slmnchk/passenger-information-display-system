package org.example.passengerinformationdisplaysystem.departures;

import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import org.example.passengerinformationdisplaysystem.departures.dto.CreateDepartureRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.CreateDeparturesRequest;
import org.example.passengerinformationdisplaysystem.departures.dto.DepartureResponse;
import org.example.passengerinformationdisplaysystem.departures.dto.JoinedDepartureDto;
import org.example.passengerinformationdisplaysystem.departures.dto.LiveTimeDto;
import org.example.passengerinformationdisplaysystem.departures.dto.UpdateLiveTimesByOriginRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
            @PageableDefault(size = 10, sort = {"scheduledTime", "id"}) Pageable pageable,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) @PositiveOrZero Long idGreaterThan) {
        return ResponseEntity.ok(service.getAllJoinedDepartures(pageable, origin, idGreaterThan));
    }

    @PostMapping("/batch")
    public ResponseEntity<List<DepartureResponse>> createDepartures(
            @Valid @RequestBody CreateDeparturesRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDepartures(request.departures()));
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

    @DeleteMapping
    public Map<String, Integer> deleteDeparturesAfterId(@RequestParam @PositiveOrZero long idGreaterThan) {
        return Map.of("count", service.deleteDeparturesAfterId(idGreaterThan));
    }

    @PostMapping("/{id}/live")
    public ResponseEntity<Void> updateLiveTime(
            @PathVariable Long id,
            @Valid @RequestBody LiveTimeDto request) {
        service.updateLiveTime(id, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/live")
    public Map<String, Integer> updateLiveTimesByOrigin(
            @Valid @RequestBody UpdateLiveTimesByOriginRequest request) {
        return Map.of("count", service.updateLiveTimesByOrigin(request.origin(), request.actualTime()));
    }

}
