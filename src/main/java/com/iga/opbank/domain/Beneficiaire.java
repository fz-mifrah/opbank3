package com.iga.opbank.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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

    @OneToMany(mappedBy = "beneficiaire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "operation", "destinataire", "beneficiaire" }, allowSetters = true)
    private Set<Virement> virements = new HashSet<>();

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

    public Set<Virement> getVirements() {
        return this.virements;
    }

    public void setVirements(Set<Virement> virements) {
        if (this.virements != null) {
            this.virements.forEach(i -> i.setBeneficiaire(null));
        }
        if (virements != null) {
            virements.forEach(i -> i.setBeneficiaire(this));
        }
        this.virements = virements;
    }

    public Beneficiaire virements(Set<Virement> virements) {
        this.setVirements(virements);
        return this;
    }

    public Beneficiaire addVirement(Virement virement) {
        this.virements.add(virement);
        virement.setBeneficiaire(this);
        return this;
    }

    public Beneficiaire removeVirement(Virement virement) {
        this.virements.remove(virement);
        virement.setBeneficiaire(null);
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
