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
 * A Facture.
 */
@Entity
@Table(name = "facture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Facture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @ManyToMany(mappedBy = "factures")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "factures", "operation" }, allowSetters = true)
    private Set<PaimentFacture> paimentFactures = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Facture nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<PaimentFacture> getPaimentFactures() {
        return this.paimentFactures;
    }

    public void setPaimentFactures(Set<PaimentFacture> paimentFactures) {
        if (this.paimentFactures != null) {
            this.paimentFactures.forEach(i -> i.removeFacture(this));
        }
        if (paimentFactures != null) {
            paimentFactures.forEach(i -> i.addFacture(this));
        }
        this.paimentFactures = paimentFactures;
    }

    public Facture paimentFactures(Set<PaimentFacture> paimentFactures) {
        this.setPaimentFactures(paimentFactures);
        return this;
    }

    public Facture addPaimentFacture(PaimentFacture paimentFacture) {
        this.paimentFactures.add(paimentFacture);
        paimentFacture.getFactures().add(this);
        return this;
    }

    public Facture removePaimentFacture(PaimentFacture paimentFacture) {
        this.paimentFactures.remove(paimentFacture);
        paimentFacture.getFactures().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facture)) {
            return false;
        }
        return id != null && id.equals(((Facture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facture{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
