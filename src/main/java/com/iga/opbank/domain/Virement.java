package com.iga.opbank.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Virement.
 */
@Entity
@Table(name = "virement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Virement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "virement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "virement" }, allowSetters = true)
    private Set<Destinataire> destinataires = new HashSet<>();

    @OneToMany(mappedBy = "virement")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "virement" }, allowSetters = true)
    private Set<Beneficiaire> beneficiaires = new HashSet<>();

    @JsonIgnoreProperties(value = { "virement", "transfer", "recharge", "paimentFacture", "compte" }, allowSetters = true)
    @OneToOne(mappedBy = "virement")
    private Operation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Virement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Virement description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Destinataire> getDestinataires() {
        return this.destinataires;
    }

    public void setDestinataires(Set<Destinataire> destinataires) {
        if (this.destinataires != null) {
            this.destinataires.forEach(i -> i.setVirement(null));
        }
        if (destinataires != null) {
            destinataires.forEach(i -> i.setVirement(this));
        }
        this.destinataires = destinataires;
    }

    public Virement destinataires(Set<Destinataire> destinataires) {
        this.setDestinataires(destinataires);
        return this;
    }

    public Virement addDestinataire(Destinataire destinataire) {
        this.destinataires.add(destinataire);
        destinataire.setVirement(this);
        return this;
    }

    public Virement removeDestinataire(Destinataire destinataire) {
        this.destinataires.remove(destinataire);
        destinataire.setVirement(null);
        return this;
    }

    public Set<Beneficiaire> getBeneficiaires() {
        return this.beneficiaires;
    }

    public void setBeneficiaires(Set<Beneficiaire> beneficiaires) {
        if (this.beneficiaires != null) {
            this.beneficiaires.forEach(i -> i.setVirement(null));
        }
        if (beneficiaires != null) {
            beneficiaires.forEach(i -> i.setVirement(this));
        }
        this.beneficiaires = beneficiaires;
    }

    public Virement beneficiaires(Set<Beneficiaire> beneficiaires) {
        this.setBeneficiaires(beneficiaires);
        return this;
    }

    public Virement addBeneficiaire(Beneficiaire beneficiaire) {
        this.beneficiaires.add(beneficiaire);
        beneficiaire.setVirement(this);
        return this;
    }

    public Virement removeBeneficiaire(Beneficiaire beneficiaire) {
        this.beneficiaires.remove(beneficiaire);
        beneficiaire.setVirement(null);
        return this;
    }

    public Operation getOperation() {
        return this.operation;
    }

    public void setOperation(Operation operation) {
        if (this.operation != null) {
            this.operation.setVirement(null);
        }
        if (operation != null) {
            operation.setVirement(this);
        }
        this.operation = operation;
    }

    public Virement operation(Operation operation) {
        this.setOperation(operation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Virement)) {
            return false;
        }
        return id != null && id.equals(((Virement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Virement{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
