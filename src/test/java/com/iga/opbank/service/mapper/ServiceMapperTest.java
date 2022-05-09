package com.iga.opbank.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ServiceMapperTest {

    private ServiceMapper serviceMapper;

    @BeforeEach
    public void setUp() {
        serviceMapper = new ServiceMapperImpl();
    }
}
