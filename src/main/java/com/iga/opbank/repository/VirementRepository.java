package com.iga.opbank.repository;

import com.iga.opbank.domain.Virement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Virement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VirementRepository extends JpaRepository<Virement, Long> {}
