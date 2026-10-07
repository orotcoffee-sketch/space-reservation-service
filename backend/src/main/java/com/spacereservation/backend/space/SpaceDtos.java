package com.spacereservation.backend.space;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class SpaceDtos {

    private SpaceDtos() {
    }

    public record SpaceRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Size(max = 5000) String description,
            @NotBlank @Size(max = 200) String location,
            @NotNull @Min(1) Integer capacity,
            @Size(max = 500) String imageUrl) {
    }

    public record StatusRequest(@NotNull Boolean active) {
    }

    public record SpaceSummary(Long id, String name, String location, int capacity, String imageUrl) {
        static SpaceSummary from(Space s) {
            return new SpaceSummary(s.getId(), s.getName(), s.getLocation(), s.getCapacity(), s.getImageUrl());
        }
    }

    public record SpaceDetail(Long id, String name, String description, String location, int capacity,
            String imageUrl, boolean active) {
        static SpaceDetail from(Space s) {
            return new SpaceDetail(s.getId(), s.getName(), s.getDescription(), s.getLocation(), s.getCapacity(),
                    s.getImageUrl(), s.isActive());
        }
    }

    public record ReservedRange(
            @JsonFormat(pattern = "HH:mm") LocalTime startTime,
            @JsonFormat(pattern = "HH:mm") LocalTime endTime) {
    }

    public record Availability(Long spaceId, LocalDate date, int intervalMinutes, List<ReservedRange> reservedRanges) {
    }
}
