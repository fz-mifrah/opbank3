package com.iga.opbank.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class BeneficiaireMapperTest {

    private BeneficiaireMapper beneficiaireMapper;

    @BeforeEach
    public void setUp() {
        beneficiaireMapper = new BeneficiaireMapperImpl();
    }
}
