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

    @OneToMany(mappedBy = "destinataire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "operation", "destinataire", "beneficiaire" }, allowSetters = true)
    private Set<Virement> virements = new HashSet<>();

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

    public Set<Virement> getVirements() {
        return this.virements;
    }

    public void setVirements(Set<Virement> virements) {
        if (this.virements != null) {
            this.virements.forEach(i -> i.setDestinataire(null));
        }
        if (virements != null) {
            virements.forEach(i -> i.setDestinataire(this));
        }
        this.virements = virements;
    }

    public Destinataire virements(Set<Virement> virements) {
        this.setVirements(virements);
        return this;
    }

    public Destinataire addVirement(Virement virement) {
        this.virements.add(virement);
        virement.setDestinataire(this);
        return this;
    }

    public Destinataire removeVirement(Virement virement) {
        this.virements.remove(virement);
        virement.setDestinataire(null);
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
