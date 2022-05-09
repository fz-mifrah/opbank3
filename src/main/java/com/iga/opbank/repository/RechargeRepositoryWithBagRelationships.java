package com.iga.opbank.repository;

import com.iga.opbank.domain.Recharge;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface RechargeRepositoryWithBagRelationships {
    Optional<Recharge> fetchBagRelationships(Optional<Recharge> recharge);

    List<Recharge> fetchBagRelationships(List<Recharge> recharges);

    Page<Recharge> fetchBagRelationships(Page<Recharge> recharges);
}
