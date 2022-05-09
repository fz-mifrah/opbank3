package com.iga.opbank.repository;

import com.iga.opbank.domain.Recharge;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class RechargeRepositoryWithBagRelationshipsImpl implements RechargeRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Recharge> fetchBagRelationships(Optional<Recharge> recharge) {
        return recharge.map(this::fetchOperateurs);
    }

    @Override
    public Page<Recharge> fetchBagRelationships(Page<Recharge> recharges) {
        return new PageImpl<>(fetchBagRelationships(recharges.getContent()), recharges.getPageable(), recharges.getTotalElements());
    }

    @Override
    public List<Recharge> fetchBagRelationships(List<Recharge> recharges) {
        return Optional.of(recharges).map(this::fetchOperateurs).orElse(Collections.emptyList());
    }

    Recharge fetchOperateurs(Recharge result) {
        return entityManager
            .createQuery(
                "select recharge from Recharge recharge left join fetch recharge.operateurs where recharge is :recharge",
                Recharge.class
            )
            .setParameter("recharge", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Recharge> fetchOperateurs(List<Recharge> recharges) {
        return entityManager
            .createQuery(
                "select distinct recharge from Recharge recharge left join fetch recharge.operateurs where recharge in :recharges",
                Recharge.class
            )
            .setParameter("recharges", recharges)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
    }
}
