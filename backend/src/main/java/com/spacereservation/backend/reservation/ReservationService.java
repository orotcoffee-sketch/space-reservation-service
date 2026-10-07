package com.spacereservation.backend.reservation;

import java.time.Clock;
import java.util.List;

import com.spacereservation.backend.common.ApiException;
import com.spacereservation.backend.common.ErrorCode;
import com.spacereservation.backend.member.MemberRepository;
import com.spacereservation.backend.reservation.ReservationDtos.AdminReservationItem;
import com.spacereservation.backend.reservation.ReservationDtos.CreateRequest;
import com.spacereservation.backend.reservation.ReservationDtos.ReservationResponse;
import com.spacereservation.backend.reservation.ReservationDtos.UpdateRequest;
import com.spacereservation.backend.space.Space;
import com.spacereservation.backend.space.SpaceRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ReservationService {

    private final ReservationRepository reservations;
    private final SpaceRepository spaces;
    private final MemberRepository members;
    private final Clock clock;

    public ReservationService(ReservationRepository reservations, SpaceRepository spaces, MemberRepository members,
            Clock clock) {
        this.reservations = reservations;
        this.spaces = spaces;
        this.members = members;
        this.clock = clock;
    }

    /** The owner is always the authenticated member; the request carries no member identifier. */
    public ReservationResponse create(Long memberId, CreateRequest req) {
        ReservationRules.validateInterval(req.startTime(), req.endTime());
        ReservationRules.validateFuture(req.reservationDate(), req.startTime(), clock);

        // Row lock on the space serializes concurrent writers, making check-then-insert safe.
        Space space = spaces.findByIdForUpdate(req.spaceId())
                .orElseThrow(() -> new ApiException(ErrorCode.SPACE_NOT_FOUND, "Space not found"));
        if (!space.isActive()) {
            throw new ApiException(ErrorCode.SPACE_INACTIVE, "Space is not accepting reservations");
        }
        requireNoOverlap(space.getId(), req.reservationDate(), req.startTime(), req.endTime(), null);

        Reservation saved = reservations.save(new Reservation(members.getReferenceById(memberId), space,
                req.reservationDate(), req.startTime(), req.endTime()));
        return ReservationResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> listMine(Long memberId) {
        return reservations.findByMember(memberId).stream().map(ReservationResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ReservationResponse getMine(Long memberId, Long id) {
        return ReservationResponse.from(findOwned(memberId, id));
    }

    public ReservationResponse update(Long memberId, Long id, UpdateRequest req) {
        Reservation reservation = findOwned(memberId, id);
        requireModifiable(reservation);
        ReservationRules.validateInterval(req.startTime(), req.endTime());
        ReservationRules.validateFuture(req.reservationDate(), req.startTime(), clock);

        Long spaceId = reservation.getSpace().getId();
        spaces.findByIdForUpdate(spaceId);
        requireNoOverlap(spaceId, req.reservationDate(), req.startTime(), req.endTime(), reservation.getId());

        reservation.reschedule(req.reservationDate(), req.startTime(), req.endTime());
        return ReservationResponse.from(reservation);
    }

    public ReservationResponse cancel(Long memberId, Long id) {
        Reservation reservation = findOwned(memberId, id);
        requireModifiable(reservation);
        reservation.cancel();
        return ReservationResponse.from(reservation);
    }

    @Transactional(readOnly = true)
    public List<AdminReservationItem> listAll() {
        return reservations.findAllWithDetails().stream().map(AdminReservationItem::from).toList();
    }

    /** Another member's reservation is reported as not found so its existence is not revealed. */
    private Reservation findOwned(Long memberId, Long id) {
        return reservations.findOwned(id, memberId)
                .orElseThrow(() -> new ApiException(ErrorCode.RESERVATION_NOT_FOUND, "Reservation not found"));
    }

    private void requireModifiable(Reservation reservation) {
        if (reservation.getStatus() == ReservationStatus.CANCELLED
                || ReservationRules.isPast(reservation.getReservationDate(), reservation.getStartTime(), clock)) {
            throw new ApiException(ErrorCode.RESERVATION_NOT_MODIFIABLE,
                    "Past or cancelled reservations cannot be changed");
        }
    }

    private void requireNoOverlap(Long spaceId, java.time.LocalDate date, java.time.LocalTime start,
            java.time.LocalTime end, Long excludeId) {
        if (reservations.existsOverlap(spaceId, date, start, end, excludeId)) {
            throw new ApiException(ErrorCode.RESERVATION_CONFLICT, "Time range overlaps an existing reservation");
        }
    }
}
