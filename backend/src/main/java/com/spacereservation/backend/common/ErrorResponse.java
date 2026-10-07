package com.spacereservation.backend.common;

import java.time.Instant;

import jakarta.servlet.http.HttpServletRequest;

public record ErrorResponse(Instant timestamp, int status, String code, String message, String path) {

    public static ErrorResponse of(ErrorCode code, String message, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), code.status().value(), code.name(), message, request.getRequestURI());
    }

    public static ErrorResponse of(int status, String code, String message, HttpServletRequest request) {
        return new ErrorResponse(Instant.now(), status, code, message, request.getRequestURI());
    }
}
