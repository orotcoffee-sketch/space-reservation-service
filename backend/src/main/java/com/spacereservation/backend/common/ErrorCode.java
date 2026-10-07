package com.spacereservation.backend.common;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST),
    AUTH_INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED),
    AUTH_REQUIRED(HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED(HttpStatus.FORBIDDEN),
    MEMBER_EMAIL_EXISTS(HttpStatus.CONFLICT),
    SPACE_NOT_FOUND(HttpStatus.NOT_FOUND),
    SPACE_INACTIVE(HttpStatus.CONFLICT),
    RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND),
    RESERVATION_CONFLICT(HttpStatus.CONFLICT),
    RESERVATION_NOT_MODIFIABLE(HttpStatus.CONFLICT);

    private final HttpStatus status;

    ErrorCode(HttpStatus status) {
        this.status = status;
    }

    public HttpStatus status() {
        return status;
    }
}
