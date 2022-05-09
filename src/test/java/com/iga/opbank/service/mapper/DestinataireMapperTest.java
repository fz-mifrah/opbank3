package com.iga.opbank.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DestinataireMapperTest {

    private DestinataireMapper destinataireMapper;

    @BeforeEach
    public void setUp() {
        destinataireMapper = new DestinataireMapperImpl();
    }
}
