package com.iga.opbank.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.iga.opbank.domain.Destinataire} entity.
 */
public class DestinataireDTO implements Serializable {

    private Long id;

    @NotNull
    private String nom;

    @NotNull
    private String prenom;

    @NotNull
    private Long rib;

    private VirementDTO virement;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Long getRib() {
        return rib;
    }

    public void setRib(Long rib) {
        this.rib = rib;
    }

    public VirementDTO getVirement() {
        return virement;
    }

    public void setVirement(VirementDTO virement) {
        this.virement = virement;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DestinataireDTO)) {
            return false;
        }

        DestinataireDTO destinataireDTO = (DestinataireDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, destinataireDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DestinataireDTO{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", rib=" + getRib() +
            ", virement=" + getVirement() +
            "}";
    }
}
