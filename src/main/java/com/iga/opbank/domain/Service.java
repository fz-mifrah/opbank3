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
 * A Service.
 */
@Entity
@Table(name = "service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Service implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom_service", nullable = false)
    private String nomService;

    @ManyToMany(mappedBy = "services")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "services", "operation" }, allowSetters = true)
    private Set<PaimentFacture> paimentFactures = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Service id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomService() {
        return this.nomService;
    }

    public Service nomService(String nomService) {
        this.setNomService(nomService);
        return this;
    }

    public void setNomService(String nomService) {
        this.nomService = nomService;
    }

    public Set<PaimentFacture> getPaimentFactures() {
        return this.paimentFactures;
    }

    public void setPaimentFactures(Set<PaimentFacture> paimentFactures) {
        if (this.paimentFactures != null) {
            this.paimentFactures.forEach(i -> i.removeService(this));
        }
        if (paimentFactures != null) {
            paimentFactures.forEach(i -> i.addService(this));
        }
        this.paimentFactures = paimentFactures;
    }

    public Service paimentFactures(Set<PaimentFacture> paimentFactures) {
        this.setPaimentFactures(paimentFactures);
        return this;
    }

    public Service addPaimentFacture(PaimentFacture paimentFacture) {
        this.paimentFactures.add(paimentFacture);
        paimentFacture.getServices().add(this);
        return this;
    }

    public Service removePaimentFacture(PaimentFacture paimentFacture) {
        this.paimentFactures.remove(paimentFacture);
        paimentFacture.getServices().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Service)) {
            return false;
        }
        return id != null && id.equals(((Service) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Service{" +
            "id=" + getId() +
            ", nomService='" + getNomService() + "'" +
            "}";
    }
}
