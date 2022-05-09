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
 * A PaimentFacture.
 */
@Entity
@Table(name = "paiment_facture")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaimentFacture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "referance", nullable = false)
    private Long referance;

    @ManyToMany
    @JoinTable(
        name = "rel_paiment_facture__facture",
        joinColumns = @JoinColumn(name = "paiment_facture_id"),
        inverseJoinColumns = @JoinColumn(name = "facture_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "paimentFactures" }, allowSetters = true)
    private Set<Facture> factures = new HashSet<>();

    @JsonIgnoreProperties(value = { "virement", "transfer", "recharge", "paimentFacture", "compte" }, allowSetters = true)
    @OneToOne(mappedBy = "paimentFacture")
    private Operation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public PaimentFacture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getReferance() {
        return this.referance;
    }

    public PaimentFacture referance(Long referance) {
        this.setReferance(referance);
        return this;
    }

    public void setReferance(Long referance) {
        this.referance = referance;
    }

    public Set<Facture> getFactures() {
        return this.factures;
    }

    public void setFactures(Set<Facture> factures) {
        this.factures = factures;
    }

    public PaimentFacture factures(Set<Facture> factures) {
        this.setFactures(factures);
        return this;
    }

    public PaimentFacture addFacture(Facture facture) {
        this.factures.add(facture);
        facture.getPaimentFactures().add(this);
        return this;
    }

    public PaimentFacture removeFacture(Facture facture) {
        this.factures.remove(facture);
        facture.getPaimentFactures().remove(this);
        return this;
    }

    public Operation getOperation() {
        return this.operation;
    }

    public void setOperation(Operation operation) {
        if (this.operation != null) {
            this.operation.setPaimentFacture(null);
        }
        if (operation != null) {
            operation.setPaimentFacture(this);
        }
        this.operation = operation;
    }

    public PaimentFacture operation(Operation operation) {
        this.setOperation(operation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaimentFacture)) {
            return false;
        }
        return id != null && id.equals(((PaimentFacture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaimentFacture{" +
            "id=" + getId() +
            ", referance=" + getReferance() +
            "}";
    }
}
