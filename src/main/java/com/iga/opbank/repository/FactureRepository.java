package com.iga.opbank.repository;

import com.iga.opbank.domain.Facture;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Facture entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {}
