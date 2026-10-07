package com.spacereservation.backend.space;

import java.time.LocalDate;
import java.util.List;

import com.spacereservation.backend.space.SpaceDtos.Availability;
import com.spacereservation.backend.space.SpaceDtos.SpaceDetail;
import com.spacereservation.backend.space.SpaceDtos.SpaceSummary;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService service;

    public SpaceController(SpaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<SpaceSummary> list() {
        return service.listActive();
    }

    @GetMapping("/{spaceId}")
    public SpaceDetail get(@PathVariable Long spaceId) {
        return service.get(spaceId);
    }

    @GetMapping("/{spaceId}/availability")
    public Availability availability(@PathVariable Long spaceId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.availability(spaceId, date);
    }
}
