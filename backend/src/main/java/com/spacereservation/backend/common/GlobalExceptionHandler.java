package com.spacereservation.backend.common;

import java.util.stream.Collectors;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(ApiException.class)
    ResponseEntity<ErrorResponse> handleApi(ApiException ex, HttpServletRequest request) {
        return ResponseEntity.status(ex.code().status()).body(ErrorResponse.of(ex.code(), ex.getMessage(), request));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ErrorResponse> handleBodyValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .sorted()
                .collect(Collectors.joining("; "));
        return validation(message.isEmpty() ? "Invalid request" : message, request);
    }

    @ExceptionHandler({ HttpMessageNotReadableException.class, MissingServletRequestParameterException.class,
            MethodArgumentTypeMismatchException.class })
    ResponseEntity<ErrorResponse> handleMalformed(Exception ex, HttpServletRequest request) {
        return validation("Malformed or missing request value", request);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    ResponseEntity<ErrorResponse> handleNoResource(NoResourceFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(404).body(ErrorResponse.of(404, "NOT_FOUND", "Resource not found", request));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    ResponseEntity<ErrorResponse> handleMethod(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        return ResponseEntity.status(405)
                .body(ErrorResponse.of(405, "METHOD_NOT_ALLOWED", "Method not allowed", request));
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error on {}", request.getRequestURI(), ex);
        return ResponseEntity.status(500)
                .body(ErrorResponse.of(500, "INTERNAL_ERROR", "Unexpected server error", request));
    }

    private ResponseEntity<ErrorResponse> validation(String message, HttpServletRequest request) {
        return ResponseEntity.status(400).body(ErrorResponse.of(ErrorCode.VALIDATION_ERROR, message, request));
    }
}
