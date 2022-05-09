package com.iga.opbank.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Destinataire.
 */
@Entity
@Table(name = "destinataire")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Destinataire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @NotNull
    @Column(name = "prenom", nullable = false)
    private String prenom;

    @NotNull
    @Column(name = "rib", nullable = false)
    private Long rib;

    @ManyToOne
    @JsonIgnoreProperties(value = { "destinataires", "beneficiaires", "operation" }, allowSetters = true)
    private Virement virement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Destinataire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Destinataire nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Destinataire prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Long getRib() {
        return this.rib;
    }

    public Destinataire rib(Long rib) {
        this.setRib(rib);
        return this;
    }

    public void setRib(Long rib) {
        this.rib = rib;
    }

    public Virement getVirement() {
        return this.virement;
    }

    public void setVirement(Virement virement) {
        this.virement = virement;
    }

    public Destinataire virement(Virement virement) {
        this.setVirement(virement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Destinataire)) {
            return false;
        }
        return id != null && id.equals(((Destinataire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Destinataire{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", rib=" + getRib() +
            "}";
    }
}
