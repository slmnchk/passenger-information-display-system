package org.example.passengerinformationdisplaysystem.departures.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateDeparturesRequest(
        @NotNull @Size(min = 1, max = 100) List<@NotNull @Valid CreateDepartureRequest> departures
) {}
