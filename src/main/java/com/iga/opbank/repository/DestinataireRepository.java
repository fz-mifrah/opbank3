package com.iga.opbank.repository;

import com.iga.opbank.domain.Destinataire;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Destinataire entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DestinataireRepository extends JpaRepository<Destinataire, Long> {}
