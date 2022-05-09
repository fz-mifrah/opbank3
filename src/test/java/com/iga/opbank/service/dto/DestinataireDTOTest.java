package com.iga.opbank.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.iga.opbank.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DestinataireDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DestinataireDTO.class);
        DestinataireDTO destinataireDTO1 = new DestinataireDTO();
        destinataireDTO1.setId(1L);
        DestinataireDTO destinataireDTO2 = new DestinataireDTO();
        assertThat(destinataireDTO1).isNotEqualTo(destinataireDTO2);
        destinataireDTO2.setId(destinataireDTO1.getId());
        assertThat(destinataireDTO1).isEqualTo(destinataireDTO2);
        destinataireDTO2.setId(2L);
        assertThat(destinataireDTO1).isNotEqualTo(destinataireDTO2);
        destinataireDTO1.setId(null);
        assertThat(destinataireDTO1).isNotEqualTo(destinataireDTO2);
    }
}
