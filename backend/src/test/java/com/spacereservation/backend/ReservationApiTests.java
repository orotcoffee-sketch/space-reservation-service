package com.spacereservation.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spacereservation.backend.member.Member;
import com.spacereservation.backend.member.MemberRepository;
import com.spacereservation.backend.member.Role;
import com.spacereservation.backend.reservation.Reservation;
import com.spacereservation.backend.reservation.ReservationRepository;
import com.spacereservation.backend.space.Space;
import com.spacereservation.backend.space.SpaceRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class ReservationApiTests {

    private static final String PASSWORD = "password123";

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired JdbcTemplate jdbc;
    @Autowired MemberRepository members;
    @Autowired SpaceRepository spaces;
    @Autowired ReservationRepository reservations;
    @Autowired PasswordEncoder encoder;
    @Autowired Clock clock;

    Space space;
    LocalDate day;

    @BeforeEach
    void clean() {
        jdbc.update("delete from reservation");
        jdbc.update("delete from space");
        jdbc.update("delete from member");
        space = spaces.save(new Space("Room A", "Meeting room", "Floor 1", 8, null));
        day = LocalDate.now(clock).plusDays(30);
    }

    // ---------- registration / login ----------

    @Test
    void registerCreatesMemberAndHidesPassword() throws Exception {
        send(post("/api/auth/register"), null,
                "{\"email\":\"A@Example.com\",\"password\":\"password123\",\"name\":\"Ann\"}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("a@example.com"))
                .andExpect(jsonPath("$.role").value("MEMBER"))
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    void registerCannotChooseRole() throws Exception {
        send(post("/api/auth/register"), null,
                "{\"email\":\"x@example.com\",\"password\":\"password123\",\"name\":\"X\",\"role\":\"ADMIN\"}")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("MEMBER"));
    }

    @Test
    void registerValidation() throws Exception {
        send(post("/api/auth/register"), null, "{\"email\":\"not-an-email\",\"password\":\"short\",\"name\":\"\"}")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
    }

    @Test
    void duplicateEmailRejected() throws Exception {
        register("dup@example.com");
        send(post("/api/auth/register"), null,
                "{\"email\":\"DUP@example.com\",\"password\":\"password123\",\"name\":\"Again\"}")
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("MEMBER_EMAIL_EXISTS"));
    }

    @Test
    void loginReturnsBearerTokenAndMember() throws Exception {
        register("login@example.com");
        send(post("/api/auth/login"), null, "{\"email\":\"login@example.com\",\"password\":\"password123\"}")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.expiresIn").value(3600))
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.member.role").value("MEMBER"))
                .andExpect(jsonPath("$.member.password").doesNotExist());
    }

    @Test
    void loginWrongPasswordAndUnknownEmailLookIdentical() throws Exception {
        register("known@example.com");
        send(post("/api/auth/login"), null, "{\"email\":\"known@example.com\",\"password\":\"wrongpassword\"}")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
        send(post("/api/auth/login"), null, "{\"email\":\"nobody@example.com\",\"password\":\"password123\"}")
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
    }

    // ---------- authentication / authorization ----------

    @Test
    void protectedEndpointsRequireAuthentication() throws Exception {
        mvc.perform(get("/api/spaces")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_REQUIRED"));
        mvc.perform(get("/api/reservations/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/admin/spaces")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/spaces").header("Authorization", "Bearer not.a.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_REQUIRED"));
    }

    @Test
    void memberCannotUseAdminEndpoints() throws Exception {
        String token = memberToken("m@example.com");
        mvc.perform(get("/api/admin/spaces").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("ACCESS_DENIED"));
        mvc.perform(get("/api/admin/reservations").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
        send(post("/api/admin/spaces"), token, spaceJson("Hall")).andExpect(status().isForbidden());
    }

    @Test
    void adminCanManageSpacesAndViewReservations() throws Exception {
        String admin = adminToken();
        String id = json.readTree(send(post("/api/admin/spaces"), admin, spaceJson("Hall"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.active").value(true))
                .andReturn().getResponse().getContentAsString()).get("id").asText();
        send(put("/api/admin/spaces/" + id), admin, spaceJson("Hall 2"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.name").value("Hall 2"));
        send(patch("/api/admin/spaces/" + id + "/status"), admin, "{\"active\":false}")
                .andExpect(status().isOk()).andExpect(jsonPath("$.active").value(false));
        mvc.perform(get("/api/admin/spaces").header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(2));
        send(post("/api/admin/spaces"), admin, "{\"name\":\"\",\"capacity\":0}")
                .andExpect(status().isBadRequest());

        String member = memberToken("m2@example.com");
        reserve(member, day, "10:00", "11:00").andExpect(status().isCreated());
        mvc.perform(get("/api/admin/reservations").header("Authorization", "Bearer " + admin))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].member.email").value("m2@example.com"))
                .andExpect(jsonPath("$[0].member.password").doesNotExist());
    }

    @Test
    void adminDoesNotGetMemberReservationEndpoints() throws Exception {
        mvc.perform(get("/api/reservations/me").header("Authorization", "Bearer " + adminToken()))
                .andExpect(status().isForbidden());
    }

    @Test
    void inactiveSpaceHiddenFromListButAvailableToAdmin() throws Exception {
        Space inactive = new Space("Old", "Closed", "B1", 2, null);
        inactive.setActive(false);
        spaces.save(inactive);
        String token = memberToken("v@example.com");
        mvc.perform(get("/api/spaces").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(1));
    }

    // ---------- reservation creation ----------

    @Test
    void createReservationUsesAuthenticatedIdentity() throws Exception {
        String token = memberToken("owner@example.com");
        reserve(token, day, "10:00", "12:00")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.startTime").value("10:00"))
                .andExpect(jsonPath("$.space.name").value("Room A"));
        Member owner = members.findByEmail("owner@example.com").orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(1,
                jdbc.queryForObject("select count(*) from reservation where member_id = ?", Integer.class,
                        owner.getId()));
    }

    @Test
    void clientSuppliedMemberIdIsIgnored() throws Exception {
        String attacker = memberToken("attacker@example.com");
        memberToken("victim@example.com");
        Long victimId = members.findByEmail("victim@example.com").orElseThrow().getId();
        send(post("/api/reservations"), attacker, "{\"spaceId\":" + space.getId() + ",\"memberId\":" + victimId
                + ",\"reservationDate\":\"" + day + "\",\"startTime\":\"10:00\",\"endTime\":\"11:00\"}")
                .andExpect(status().isCreated());
        Long attackerId = members.findByEmail("attacker@example.com").orElseThrow().getId();
        org.junit.jupiter.api.Assertions.assertEquals(1,
                jdbc.queryForObject("select count(*) from reservation where member_id = ?", Integer.class,
                        attackerId));
    }

    @Test
    void createValidationErrors() throws Exception {
        String token = memberToken("val@example.com");
        reserve(token, day, "10:15", "11:00").andExpect(status().isBadRequest());
        reserve(token, day, "11:00", "10:00").andExpect(status().isBadRequest());
        reserve(token, day, "10:00", "10:00").andExpect(status().isBadRequest());
        reserve(token, LocalDate.now(clock).minusDays(1), "10:00", "11:00")
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_ERROR"));
        send(post("/api/reservations"), token, "{\"spaceId\":" + space.getId() + "}")
                .andExpect(status().isBadRequest());
    }

    @Test
    void unknownSpaceRejected() throws Exception {
        String token = memberToken("ns@example.com");
        send(post("/api/reservations"), token, "{\"spaceId\":999999,\"reservationDate\":\"" + day
                + "\",\"startTime\":\"10:00\",\"endTime\":\"11:00\"}")
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("SPACE_NOT_FOUND"));
    }

    @Test
    void inactiveSpaceRejected() throws Exception {
        space.setActive(false);
        spaces.save(space);
        reserve(memberToken("ia@example.com"), day, "10:00", "11:00")
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("SPACE_INACTIVE"));
    }

    // ---------- overlap ----------

    @Test
    void overlappingReservationsRejected() throws Exception {
        String token = memberToken("ov@example.com");
        reserve(token, day, "10:00", "12:00").andExpect(status().isCreated());
        String[][] conflicts = { { "09:00", "11:00" }, { "10:30", "11:30" }, { "11:00", "13:00" },
                { "09:00", "13:00" }, { "10:00", "11:00" }, { "10:00", "12:00" } };
        for (String[] c : conflicts) {
            reserve(token, day, c[0], c[1]).andExpect(status().isConflict())
                    .andExpect(jsonPath("$.code").value("RESERVATION_CONFLICT"));
        }
    }

    @Test
    void adjacentReservationsAccepted() throws Exception {
        String token = memberToken("adj@example.com");
        reserve(token, day, "10:00", "12:00").andExpect(status().isCreated());
        reserve(token, day, "08:00", "10:00").andExpect(status().isCreated());
        reserve(token, day, "12:00", "14:00").andExpect(status().isCreated());
    }

    @Test
    void sameTimeOnDifferentSpaceOrDateAccepted() throws Exception {
        Space other = spaces.save(new Space("Room B", "Other", "Floor 2", 4, null));
        String token = memberToken("diff@example.com");
        reserve(token, day, "10:00", "12:00").andExpect(status().isCreated());
        send(post("/api/reservations"), token, "{\"spaceId\":" + other.getId() + ",\"reservationDate\":\"" + day
                + "\",\"startTime\":\"10:00\",\"endTime\":\"12:00\"}").andExpect(status().isCreated());
        reserve(token, day.plusDays(1), "10:00", "12:00").andExpect(status().isCreated());
    }

    @Test
    void cancelledReservationDoesNotBlock() throws Exception {
        String token = memberToken("cn@example.com");
        String id = idOf(reserve(token, day, "10:00", "12:00").andExpect(status().isCreated()));
        send(patch("/api/reservations/" + id + "/cancel"), token, null)
                .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELLED"));
        reserve(token, day, "10:00", "12:00").andExpect(status().isCreated());
    }

    @Test
    void availabilityListsConfirmedRangesOnly() throws Exception {
        String token = memberToken("av@example.com");
        reserve(token, day, "10:00", "12:00").andExpect(status().isCreated());
        String cancelled = idOf(reserve(token, day, "14:00", "15:00").andExpect(status().isCreated()));
        send(patch("/api/reservations/" + cancelled + "/cancel"), token, null).andExpect(status().isOk());
        mvc.perform(get("/api/spaces/" + space.getId() + "/availability").param("date", day.toString())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.intervalMinutes").value(30))
                .andExpect(jsonPath("$.reservedRanges.length()").value(1))
                .andExpect(jsonPath("$.reservedRanges[0].startTime").value("10:00"))
                .andExpect(jsonPath("$.reservedRanges[0].endTime").value("12:00"));
        mvc.perform(get("/api/spaces/" + space.getId() + "/availability")
                .header("Authorization", "Bearer " + token)).andExpect(status().isBadRequest());
    }

    // ---------- ownership ----------

    @Test
    void otherMembersReservationIsNotFound() throws Exception {
        String owner = memberToken("o1@example.com");
        String other = memberToken("o2@example.com");
        String id = idOf(reserve(owner, day, "10:00", "11:00").andExpect(status().isCreated()));
        mvc.perform(get("/api/reservations/" + id).header("Authorization", "Bearer " + other))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RESERVATION_NOT_FOUND"));
        send(put("/api/reservations/" + id), other, updateJson(day, "13:00", "14:00"))
                .andExpect(status().isNotFound());
        send(patch("/api/reservations/" + id + "/cancel"), other, null).andExpect(status().isNotFound());
        mvc.perform(get("/api/reservations/me").header("Authorization", "Bearer " + other))
                .andExpect(jsonPath("$.length()").value(0));
        mvc.perform(get("/api/reservations/" + id).header("Authorization", "Bearer " + owner))
                .andExpect(status().isOk());
    }

    // ---------- modification ----------

    @Test
    void ownerCanModifyAndSelfOverlapIsAllowed() throws Exception {
        String token = memberToken("mod@example.com");
        String id = idOf(reserve(token, day, "10:00", "12:00").andExpect(status().isCreated()));
        send(put("/api/reservations/" + id), token, updateJson(day, "11:00", "13:00"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.startTime").value("11:00"));
        reserve(token, day, "14:00", "15:00").andExpect(status().isCreated());
        send(put("/api/reservations/" + id), token, updateJson(day, "13:30", "14:30"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RESERVATION_CONFLICT"));
        send(put("/api/reservations/" + id), token, updateJson(day, "11:10", "13:00"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void pastReservationCannotBeModifiedOrCancelled() throws Exception {
        Member member = members.save(new Member("past@example.com", encoder.encode(PASSWORD), "Past", Role.MEMBER));
        Reservation past = reservations.save(new Reservation(member, space, LocalDate.now(clock).minusDays(2),
                LocalTime.of(10, 0), LocalTime.of(11, 0)));
        String token = login("past@example.com");
        mvc.perform(get("/api/reservations/" + past.getId()).header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        send(put("/api/reservations/" + past.getId()), token, updateJson(day, "10:00", "11:00"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESERVATION_NOT_MODIFIABLE"));
        send(patch("/api/reservations/" + past.getId() + "/cancel"), token, null)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESERVATION_NOT_MODIFIABLE"));
    }

    // ---------- cancellation ----------

    @Test
    void cancelledReservationStaysVisibleButIsNotModifiable() throws Exception {
        String token = memberToken("cv@example.com");
        String id = idOf(reserve(token, day, "10:00", "11:00").andExpect(status().isCreated()));
        send(patch("/api/reservations/" + id + "/cancel"), token, null).andExpect(status().isOk());
        send(patch("/api/reservations/" + id + "/cancel"), token, null)
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("RESERVATION_NOT_MODIFIABLE"));
        send(put("/api/reservations/" + id), token, updateJson(day, "12:00", "13:00"))
                .andExpect(status().isConflict());
        mvc.perform(get("/api/reservations/me").header("Authorization", "Bearer " + token))
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].status").value("CANCELLED"));
        org.junit.jupiter.api.Assertions.assertEquals(1,
                jdbc.queryForObject("select count(*) from reservation", Integer.class));
    }

    // ---------- helpers ----------

    private ResultActions send(MockHttpServletRequestBuilder builder, String token, String body) throws Exception {
        builder.contentType(MediaType.APPLICATION_JSON);
        if (token != null) {
            builder.header("Authorization", "Bearer " + token);
        }
        if (body != null) {
            builder.content(body);
        }
        return mvc.perform(builder);
    }

    private ResultActions reserve(String token, LocalDate date, String start, String end) throws Exception {
        return send(post("/api/reservations"), token, "{\"spaceId\":" + space.getId() + ",\"reservationDate\":\""
                + date + "\",\"startTime\":\"" + start + "\",\"endTime\":\"" + end + "\"}");
    }

    private String updateJson(LocalDate date, String start, String end) {
        return "{\"reservationDate\":\"" + date + "\",\"startTime\":\"" + start + "\",\"endTime\":\"" + end + "\"}";
    }

    private String spaceJson(String name) {
        return "{\"name\":\"" + name + "\",\"description\":\"d\",\"location\":\"l\",\"capacity\":5}";
    }

    private String idOf(ResultActions actions) throws Exception {
        JsonNode node = json.readTree(actions.andReturn().getResponse().getContentAsString());
        return node.get("id").asText();
    }

    private void register(String email) throws Exception {
        send(post("/api/auth/register"), null,
                "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\",\"name\":\"Tester\"}")
                .andExpect(status().isCreated());
    }

    private String login(String email) throws Exception {
        String body = send(post("/api/auth/login"), null,
                "{\"email\":\"" + email + "\",\"password\":\"" + PASSWORD + "\"}")
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        return json.readTree(body).get("accessToken").asText();
    }

    private String memberToken(String email) throws Exception {
        register(email);
        return login(email);
    }

    private String adminToken() throws Exception {
        members.save(new Member("admin@example.com", encoder.encode(PASSWORD), "Admin", Role.ADMIN));
        return login("admin@example.com");
    }
}
