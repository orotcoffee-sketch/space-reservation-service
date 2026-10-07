CREATE TABLE member (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT uk_member_email UNIQUE (email)
);

CREATE TABLE space (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    capacity INT NOT NULL,
    image_url VARCHAR(500) NULL,
    active BOOLEAN NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE reservation (
    id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    space_id BIGINT NOT NULL,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_reservation_member FOREIGN KEY (member_id) REFERENCES member (id),
    CONSTRAINT fk_reservation_space FOREIGN KEY (space_id) REFERENCES space (id),
    INDEX idx_reservation_space_date (space_id, reservation_date),
    INDEX idx_reservation_member (member_id)
);
