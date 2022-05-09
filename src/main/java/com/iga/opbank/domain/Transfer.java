package com.iga.opbank.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Transfer.
 */
@Entity
@Table(name = "transfer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Transfer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "cin_destinataire_ii", nullable = false)
    private String cinDestinataireII;

    @NotNull
    @Column(name = "nom_prenom_destinataire_ii", nullable = false)
    private String nomPrenomDestinataireII;

    @Column(name = "tel_destinataire_ii")
    private Long telDestinataireII;

    @JsonIgnoreProperties(value = { "virement", "transfer", "recharge", "paimentFacture", "compte" }, allowSetters = true)
    @OneToOne(mappedBy = "transfer")
    private Operation operation;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Transfer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCinDestinataireII() {
        return this.cinDestinataireII;
    }

    public Transfer cinDestinataireII(String cinDestinataireII) {
        this.setCinDestinataireII(cinDestinataireII);
        return this;
    }

    public void setCinDestinataireII(String cinDestinataireII) {
        this.cinDestinataireII = cinDestinataireII;
    }

    public String getNomPrenomDestinataireII() {
        return this.nomPrenomDestinataireII;
    }

    public Transfer nomPrenomDestinataireII(String nomPrenomDestinataireII) {
        this.setNomPrenomDestinataireII(nomPrenomDestinataireII);
        return this;
    }

    public void setNomPrenomDestinataireII(String nomPrenomDestinataireII) {
        this.nomPrenomDestinataireII = nomPrenomDestinataireII;
    }

    public Long getTelDestinataireII() {
        return this.telDestinataireII;
    }

    public Transfer telDestinataireII(Long telDestinataireII) {
        this.setTelDestinataireII(telDestinataireII);
        return this;
    }

    public void setTelDestinataireII(Long telDestinataireII) {
        this.telDestinataireII = telDestinataireII;
    }

    public Operation getOperation() {
        return this.operation;
    }

    public void setOperation(Operation operation) {
        if (this.operation != null) {
            this.operation.setTransfer(null);
        }
        if (operation != null) {
            operation.setTransfer(this);
        }
        this.operation = operation;
    }

    public Transfer operation(Operation operation) {
        this.setOperation(operation);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Transfer)) {
            return false;
        }
        return id != null && id.equals(((Transfer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Transfer{" +
            "id=" + getId() +
            ", cinDestinataireII='" + getCinDestinataireII() + "'" +
            ", nomPrenomDestinataireII='" + getNomPrenomDestinataireII() + "'" +
            ", telDestinataireII=" + getTelDestinataireII() +
            "}";
    }
}
