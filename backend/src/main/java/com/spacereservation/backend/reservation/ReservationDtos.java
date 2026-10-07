package com.spacereservation.backend.reservation;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotNull;

public final class ReservationDtos {

    private ReservationDtos() {
    }

    public record CreateRequest(
            @NotNull Long spaceId,
            @NotNull LocalDate reservationDate,
            @NotNull @JsonFormat(pattern = "HH:mm") LocalTime startTime,
            @NotNull @JsonFormat(pattern = "HH:mm") LocalTime endTime) {
    }

    public record UpdateRequest(
            @NotNull LocalDate reservationDate,
            @NotNull @JsonFormat(pattern = "HH:mm") LocalTime startTime,
            @NotNull @JsonFormat(pattern = "HH:mm") LocalTime endTime) {
    }

    public record SpaceRef(Long id, String name, String location) {
    }

    public record ReservationResponse(
            Long id,
            SpaceRef space,
            LocalDate reservationDate,
            @JsonFormat(pattern = "HH:mm") LocalTime startTime,
            @JsonFormat(pattern = "HH:mm") LocalTime endTime,
            ReservationStatus status) {

        static ReservationResponse from(Reservation r) {
            return new ReservationResponse(r.getId(),
                    new SpaceRef(r.getSpace().getId(), r.getSpace().getName(), r.getSpace().getLocation()),
                    r.getReservationDate(), r.getStartTime(), r.getEndTime(), r.getStatus());
        }
    }

    public record AdminMemberRef(String name, String email) {
    }

    public record AdminSpaceRef(Long id, String name) {
    }

    public record AdminReservationItem(
            Long reservationId,
            AdminMemberRef member,
            AdminSpaceRef space,
            LocalDate reservationDate,
            @JsonFormat(pattern = "HH:mm") LocalTime startTime,
            @JsonFormat(pattern = "HH:mm") LocalTime endTime,
            ReservationStatus status) {

        static AdminReservationItem from(Reservation r) {
            return new AdminReservationItem(r.getId(),
                    new AdminMemberRef(r.getMember().getName(), r.getMember().getEmail()),
                    new AdminSpaceRef(r.getSpace().getId(), r.getSpace().getName()),
                    r.getReservationDate(), r.getStartTime(), r.getEndTime(), r.getStatus());
        }
    }
}
