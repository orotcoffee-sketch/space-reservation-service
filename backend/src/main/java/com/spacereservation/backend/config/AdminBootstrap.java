package com.spacereservation.backend.config;

import com.spacereservation.backend.member.Member;
import com.spacereservation.backend.member.MemberRepository;
import com.spacereservation.backend.member.Role;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Idempotent environment-based administrator provisioning (auth-architecture.md). */
@Component
public class AdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);
    private static final int MIN_PASSWORD_LENGTH = 8;

    private final AppProperties props;
    private final MemberRepository members;
    private final PasswordEncoder encoder;

    public AdminBootstrap(AppProperties props, MemberRepository members, PasswordEncoder encoder) {
        this.props = props;
        this.members = members;
        this.encoder = encoder;
    }

    @Override
    public void run(ApplicationArguments args) {
        String email = props.admin().email();
        String password = props.admin().initialPassword();
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            log.info("Admin bootstrap skipped: ADMIN_EMAIL / ADMIN_INITIAL_PASSWORD not set");
            return;
        }
        if (password.length() < MIN_PASSWORD_LENGTH) {
            throw new IllegalStateException("ADMIN_INITIAL_PASSWORD must be at least " + MIN_PASSWORD_LENGTH
                    + " characters");
        }
        String normalized = email.trim().toLowerCase();
        if (members.existsByEmail(normalized)) {
            return;
        }
        members.save(new Member(normalized, encoder.encode(password), "Administrator", Role.ADMIN));
        log.info("Bootstrap administrator account created");
    }
}
