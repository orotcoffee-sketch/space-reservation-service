package com.spacereservation.backend.reservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findBySpaceIdAndReservationDateAndStatusOrderByStartTimeAsc(Long spaceId, LocalDate date,
            ReservationStatus status);

    /** Overlap rule: newStart < existingEnd AND newEnd > existingStart, CONFIRMED only. */
    @Query("""
            select count(r) > 0 from Reservation r
            where r.space.id = :spaceId
              and r.reservationDate = :date
              and r.status = com.spacereservation.backend.reservation.ReservationStatus.CONFIRMED
              and r.startTime < :end
              and r.endTime > :start
              and (:excludeId is null or r.id <> :excludeId)
            """)
    boolean existsOverlap(@Param("spaceId") Long spaceId, @Param("date") LocalDate date,
            @Param("start") LocalTime start, @Param("end") LocalTime end, @Param("excludeId") Long excludeId);

    @Query("""
            select r from Reservation r join fetch r.space
            where r.member.id = :memberId
            order by r.reservationDate desc, r.startTime desc
            """)
    List<Reservation> findByMember(@Param("memberId") Long memberId);

    @Query("select r from Reservation r join fetch r.space where r.id = :id and r.member.id = :memberId")
    Optional<Reservation> findOwned(@Param("id") Long id, @Param("memberId") Long memberId);

    @Query("""
            select r from Reservation r join fetch r.space join fetch r.member
            order by r.reservationDate desc, r.startTime desc, r.id desc
            """)
    List<Reservation> findAllWithDetails();
}
