package com.spacereservation.backend.auth;

import java.time.Duration;
import java.time.Instant;

import javax.crypto.SecretKey;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.spacereservation.backend.config.AppProperties;
import com.spacereservation.backend.member.Member;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.stereotype.Service;

/** Issues HS256-signed access tokens: subject = member id, claim "role". */
@Service
public class JwtService {

    private final JwtEncoder encoder;
    private final Duration lifetime;

    public JwtService(SecretKey jwtSigningKey, AppProperties props) {
        this.encoder = new NimbusJwtEncoder(new ImmutableSecret<>(jwtSigningKey));
        this.lifetime = Duration.ofMinutes(props.jwt().expirationMinutes());
    }

    public long expiresInSeconds() {
        return lifetime.toSeconds();
    }

    public String issue(Member member) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(String.valueOf(member.getId()))
                .issuedAt(now)
                .expiresAt(now.plus(lifetime))
                .claim("role", member.getRole().name())
                .build();
        return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
                .getTokenValue();
    }
}
