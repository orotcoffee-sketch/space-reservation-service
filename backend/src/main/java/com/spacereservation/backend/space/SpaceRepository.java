package com.spacereservation.backend.space;

import java.util.List;
import java.util.Optional;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    List<Space> findByActiveTrueOrderByIdAsc();

    List<Space> findAllByOrderByIdAsc();

    /** Row lock used to serialize reservation writes per space (overlap prevention). */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from Space s where s.id = :id")
    Optional<Space> findByIdForUpdate(@Param("id") Long id);
}
