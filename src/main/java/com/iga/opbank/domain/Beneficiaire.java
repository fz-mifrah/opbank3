package com.iga.opbank.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Beneficiaire.
 */
@Entity
@Table(name = "beneficiaire")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Beneficiaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom_prenom", nullable = false)
    private String nomPrenom;

    @NotNull
    @Column(name = "num_compte", nullable = false)
    private Long numCompte;

    @ManyToOne
    @JsonIgnoreProperties(value = { "destinataires", "beneficiaires", "operation" }, allowSetters = true)
    private Virement virement;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Beneficiaire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomPrenom() {
        return this.nomPrenom;
    }

    public Beneficiaire nomPrenom(String nomPrenom) {
        this.setNomPrenom(nomPrenom);
        return this;
    }

    public void setNomPrenom(String nomPrenom) {
        this.nomPrenom = nomPrenom;
    }

    public Long getNumCompte() {
        return this.numCompte;
    }

    public Beneficiaire numCompte(Long numCompte) {
        this.setNumCompte(numCompte);
        return this;
    }

    public void setNumCompte(Long numCompte) {
        this.numCompte = numCompte;
    }

    public Virement getVirement() {
        return this.virement;
    }

    public void setVirement(Virement virement) {
        this.virement = virement;
    }

    public Beneficiaire virement(Virement virement) {
        this.setVirement(virement);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Beneficiaire)) {
            return false;
        }
        return id != null && id.equals(((Beneficiaire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Beneficiaire{" +
            "id=" + getId() +
            ", nomPrenom='" + getNomPrenom() + "'" +
            ", numCompte=" + getNumCompte() +
            "}";
    }
}
