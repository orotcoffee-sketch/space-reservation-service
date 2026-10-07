package com.spacereservation.backend.space;

import java.time.LocalDate;
import java.util.List;

import com.spacereservation.backend.common.ApiException;
import com.spacereservation.backend.common.ErrorCode;
import com.spacereservation.backend.reservation.ReservationRepository;
import com.spacereservation.backend.reservation.ReservationRules;
import com.spacereservation.backend.reservation.ReservationStatus;
import com.spacereservation.backend.space.SpaceDtos.Availability;
import com.spacereservation.backend.space.SpaceDtos.ReservedRange;
import com.spacereservation.backend.space.SpaceDtos.SpaceDetail;
import com.spacereservation.backend.space.SpaceDtos.SpaceRequest;
import com.spacereservation.backend.space.SpaceDtos.SpaceSummary;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class SpaceService {

    private final SpaceRepository spaces;
    private final ReservationRepository reservations;

    public SpaceService(SpaceRepository spaces, ReservationRepository reservations) {
        this.spaces = spaces;
        this.reservations = reservations;
    }

    public List<SpaceSummary> listActive() {
        return spaces.findByActiveTrueOrderByIdAsc().stream().map(SpaceSummary::from).toList();
    }

    public List<SpaceDetail> listAll() {
        return spaces.findAllByOrderByIdAsc().stream().map(SpaceDetail::from).toList();
    }

    public SpaceDetail get(Long id) {
        return SpaceDetail.from(find(id));
    }

    public Availability availability(Long id, LocalDate date) {
        find(id);
        List<ReservedRange> ranges = reservations
                .findBySpaceIdAndReservationDateAndStatusOrderByStartTimeAsc(id, date, ReservationStatus.CONFIRMED)
                .stream().map(r -> new ReservedRange(r.getStartTime(), r.getEndTime())).toList();
        return new Availability(id, date, ReservationRules.INTERVAL_MINUTES, ranges);
    }

    @Transactional
    public SpaceDetail create(SpaceRequest req) {
        Space space = new Space(req.name().trim(), req.description().trim(), req.location().trim(), req.capacity(),
                blankToNull(req.imageUrl()));
        return SpaceDetail.from(spaces.save(space));
    }

    @Transactional
    public SpaceDetail update(Long id, SpaceRequest req) {
        Space space = find(id);
        space.update(req.name().trim(), req.description().trim(), req.location().trim(), req.capacity(),
                blankToNull(req.imageUrl()));
        return SpaceDetail.from(space);
    }

    @Transactional
    public SpaceDetail setActive(Long id, boolean active) {
        Space space = find(id);
        space.setActive(active);
        return SpaceDetail.from(space);
    }

    private Space find(Long id) {
        return spaces.findById(id).orElseThrow(() -> new ApiException(ErrorCode.SPACE_NOT_FOUND, "Space not found"));
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
