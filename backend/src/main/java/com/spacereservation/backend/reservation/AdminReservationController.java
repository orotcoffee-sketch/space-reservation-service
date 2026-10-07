package com.spacereservation.backend.reservation;

import java.util.List;

import com.spacereservation.backend.reservation.ReservationDtos.AdminReservationItem;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

    private final ReservationService service;

    public AdminReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public List<AdminReservationItem> list() {
        return service.listAll();
    }
}
