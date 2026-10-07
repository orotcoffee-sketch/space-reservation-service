package com.spacereservation.backend.reservation;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.spacereservation.backend.common.ApiException;
import com.spacereservation.backend.common.ErrorCode;

/** Pure reservation business rules (BR-005, BR-009, BR-010, BR-011, BR-014). */
public final class ReservationRules {

    public static final int INTERVAL_MINUTES = 30;

    private ReservationRules() {
    }

    /** BR-005 and BR-009. Same-date (BR-010) is structural: the API carries a single date. */
    public static void validateInterval(LocalTime start, LocalTime end) {
        if (!onBoundary(start) || !onBoundary(end)) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR,
                    "Times must be on a " + INTERVAL_MINUTES + "-minute boundary");
        }
        if (!start.isBefore(end)) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "startTime must be earlier than endTime");
        }
    }

    /** BR-014: the start must be in the future in the business timezone (the Clock's zone). */
    public static void validateFuture(LocalDate date, LocalTime start, Clock clock) {
        if (!isFuture(date, start, clock)) {
            throw new ApiException(ErrorCode.VALIDATION_ERROR, "Reservation must start in the future");
        }
    }

    /** BR-011: a reservation whose start is not in the future is past. */
    public static boolean isPast(LocalDate date, LocalTime start, Clock clock) {
        return !isFuture(date, start, clock);
    }

    private static boolean isFuture(LocalDate date, LocalTime start, Clock clock) {
        return LocalDateTime.of(date, start).isAfter(LocalDateTime.now(clock));
    }

    private static boolean onBoundary(LocalTime t) {
        return t.getMinute() % INTERVAL_MINUTES == 0 && t.getSecond() == 0 && t.getNano() == 0;
    }
}
