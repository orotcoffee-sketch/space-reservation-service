package com.spacereservation.backend.auth;

import java.util.Locale;

import com.spacereservation.backend.auth.AuthDtos.LoginRequest;
import com.spacereservation.backend.auth.AuthDtos.LoginResponse;
import com.spacereservation.backend.auth.AuthDtos.MemberResponse;
import com.spacereservation.backend.auth.AuthDtos.RegisterRequest;
import com.spacereservation.backend.common.ApiException;
import com.spacereservation.backend.common.ErrorCode;
import com.spacereservation.backend.member.Member;
import com.spacereservation.backend.member.MemberRepository;
import com.spacereservation.backend.member.Role;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final MemberRepository members;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final String dummyHash;

    public AuthService(MemberRepository members, PasswordEncoder encoder, JwtService jwt) {
        this.members = members;
        this.encoder = encoder;
        this.jwt = jwt;
        this.dummyHash = encoder.encode("timing-equalization-placeholder");
    }

    /** Public registration always creates a MEMBER. */
    public MemberResponse register(RegisterRequest req) {
        String email = normalize(req.email());
        if (members.existsByEmail(email)) {
            throw emailExists();
        }
        try {
            Member saved = members.saveAndFlush(
                    new Member(email, encoder.encode(req.password()), req.name().trim(), Role.MEMBER));
            return MemberResponse.from(saved);
        } catch (DataIntegrityViolationException e) {
            throw emailExists();
        }
    }

    public LoginResponse login(LoginRequest req) {
        Member member = members.findByEmail(normalize(req.email())).orElse(null);
        // Always run one BCrypt comparison so response time does not reveal whether the email exists.
        boolean ok = encoder.matches(req.password(), member == null ? dummyHash : member.getPassword());
        if (member == null || !ok) {
            throw new ApiException(ErrorCode.AUTH_INVALID_CREDENTIALS, "Invalid email or password");
        }
        return new LoginResponse(jwt.issue(member), "Bearer", jwt.expiresInSeconds(), MemberResponse.from(member));
    }

    private static String normalize(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static ApiException emailExists() {
        return new ApiException(ErrorCode.MEMBER_EMAIL_EXISTS, "Email is already registered");
    }
}
