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
 * A Operateur.
 */
@Entity
@Table(name = "operateur")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Operateur implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom", nullable = false)
    private String nom;

    @ManyToMany(mappedBy = "operateurs")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "operateurs", "operation" }, allowSetters = true)
    private Set<Recharge> recharges = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Operateur id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return this.nom;
    }

    public Operateur nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Set<Recharge> getRecharges() {
        return this.recharges;
    }

    public void setRecharges(Set<Recharge> recharges) {
        if (this.recharges != null) {
            this.recharges.forEach(i -> i.removeOperateur(this));
        }
        if (recharges != null) {
            recharges.forEach(i -> i.addOperateur(this));
        }
        this.recharges = recharges;
    }

    public Operateur recharges(Set<Recharge> recharges) {
        this.setRecharges(recharges);
        return this;
    }

    public Operateur addRecharge(Recharge recharge) {
        this.recharges.add(recharge);
        recharge.getOperateurs().add(this);
        return this;
    }

    public Operateur removeRecharge(Recharge recharge) {
        this.recharges.remove(recharge);
        recharge.getOperateurs().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Operateur)) {
            return false;
        }
        return id != null && id.equals(((Operateur) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Operateur{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
