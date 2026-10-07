package com.spacereservation.backend.auth;

import com.spacereservation.backend.member.Member;
import com.spacereservation.backend.member.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

    private AuthDtos() {
    }

    /** No role field: a client can never choose a role. Unknown JSON properties are ignored. */
    public record RegisterRequest(
            @NotBlank @Email @Size(max = 255) String email,
            @NotBlank @Size(min = 8, max = 72) String password,
            @NotBlank @Size(max = 100) String name) {
    }

    public record LoginRequest(@NotBlank String email, @NotBlank String password) {
    }

    public record MemberResponse(Long id, String email, String name, Role role) {
        static MemberResponse from(Member m) {
            return new MemberResponse(m.getId(), m.getEmail(), m.getName(), m.getRole());
        }
    }

    public record LoginResponse(String accessToken, String tokenType, long expiresIn, MemberResponse member) {
    }
}
