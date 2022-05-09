package com.iga.opbank.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.iga.opbank.domain.Transfer} entity.
 */
public class TransferDTO implements Serializable {

    private Long id;

    @NotNull
    private String cinDestinataireII;

    @NotNull
    private String nomPrenomDestinataireII;

    private Long telDestinataireII;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCinDestinataireII() {
        return cinDestinataireII;
    }

    public void setCinDestinataireII(String cinDestinataireII) {
        this.cinDestinataireII = cinDestinataireII;
    }

    public String getNomPrenomDestinataireII() {
        return nomPrenomDestinataireII;
    }

    public void setNomPrenomDestinataireII(String nomPrenomDestinataireII) {
        this.nomPrenomDestinataireII = nomPrenomDestinataireII;
    }

    public Long getTelDestinataireII() {
        return telDestinataireII;
    }

    public void setTelDestinataireII(Long telDestinataireII) {
        this.telDestinataireII = telDestinataireII;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TransferDTO)) {
            return false;
        }

        TransferDTO transferDTO = (TransferDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, transferDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TransferDTO{" +
            "id=" + getId() +
            ", cinDestinataireII='" + getCinDestinataireII() + "'" +
            ", nomPrenomDestinataireII='" + getNomPrenomDestinataireII() + "'" +
            ", telDestinataireII=" + getTelDestinataireII() +
            "}";
    }
}
