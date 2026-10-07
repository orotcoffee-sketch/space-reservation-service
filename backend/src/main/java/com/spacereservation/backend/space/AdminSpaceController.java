package com.spacereservation.backend.space;

import java.util.List;

import com.spacereservation.backend.space.SpaceDtos.SpaceDetail;
import com.spacereservation.backend.space.SpaceDtos.SpaceRequest;
import com.spacereservation.backend.space.SpaceDtos.StatusRequest;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/admin/spaces")
public class AdminSpaceController {

    private final SpaceService service;

    public AdminSpaceController(SpaceService service) {
        this.service = service;
    }

    @GetMapping
    public List<SpaceDetail> list() {
        return service.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SpaceDetail create(@Valid @RequestBody SpaceRequest request) {
        return service.create(request);
    }

    @PutMapping("/{spaceId}")
    public SpaceDetail update(@PathVariable Long spaceId, @Valid @RequestBody SpaceRequest request) {
        return service.update(spaceId, request);
    }

    @PatchMapping("/{spaceId}/status")
    public SpaceDetail setStatus(@PathVariable Long spaceId, @Valid @RequestBody StatusRequest request) {
        return service.setActive(spaceId, request.active());
    }
}
