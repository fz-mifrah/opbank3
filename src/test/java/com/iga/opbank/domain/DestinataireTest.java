package com.iga.opbank.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.iga.opbank.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DestinataireTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Destinataire.class);
        Destinataire destinataire1 = new Destinataire();
        destinataire1.setId(1L);
        Destinataire destinataire2 = new Destinataire();
        destinataire2.setId(destinataire1.getId());
        assertThat(destinataire1).isEqualTo(destinataire2);
        destinataire2.setId(2L);
        assertThat(destinataire1).isNotEqualTo(destinataire2);
        destinataire1.setId(null);
        assertThat(destinataire1).isNotEqualTo(destinataire2);
    }
}
