package com.iga.opbank.repository;

import com.iga.opbank.domain.PaimentFacture;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the PaimentFacture entity.
 */
@Repository
public interface PaimentFactureRepository extends PaimentFactureRepositoryWithBagRelationships, JpaRepository<PaimentFacture, Long> {
    default Optional<PaimentFacture> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<PaimentFacture> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<PaimentFacture> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
