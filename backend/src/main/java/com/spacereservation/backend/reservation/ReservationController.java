package com.spacereservation.backend.reservation;

import java.util.List;

import com.spacereservation.backend.reservation.ReservationDtos.CreateRequest;
import com.spacereservation.backend.reservation.ReservationDtos.ReservationResponse;
import com.spacereservation.backend.reservation.ReservationDtos.UpdateRequest;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReservationResponse create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateRequest request) {
        return service.create(memberId(jwt), request);
    }

    @GetMapping("/me")
    public List<ReservationResponse> mine(@AuthenticationPrincipal Jwt jwt) {
        return service.listMine(memberId(jwt));
    }

    @GetMapping("/{reservationId}")
    public ReservationResponse get(@AuthenticationPrincipal Jwt jwt, @PathVariable Long reservationId) {
        return service.getMine(memberId(jwt), reservationId);
    }

    @PutMapping("/{reservationId}")
    public ReservationResponse update(@AuthenticationPrincipal Jwt jwt, @PathVariable Long reservationId,
            @Valid @RequestBody UpdateRequest request) {
        return service.update(memberId(jwt), reservationId, request);
    }

    @PatchMapping("/{reservationId}/cancel")
    public ReservationResponse cancel(@AuthenticationPrincipal Jwt jwt, @PathVariable Long reservationId) {
        return service.cancel(memberId(jwt), reservationId);
    }

    private static Long memberId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }
}
