package com.iga.opbank.repository;

import com.iga.opbank.domain.Operation;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Operation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {}
