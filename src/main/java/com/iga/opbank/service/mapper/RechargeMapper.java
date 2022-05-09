package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Operateur;
import com.iga.opbank.domain.Recharge;
import com.iga.opbank.service.dto.OperateurDTO;
import com.iga.opbank.service.dto.RechargeDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Recharge} and its DTO {@link RechargeDTO}.
 */
@Mapper(componentModel = "spring")
public interface RechargeMapper extends EntityMapper<RechargeDTO, Recharge> {
    @Mapping(target = "operateurs", source = "operateurs", qualifiedByName = "operateurNomSet")
    RechargeDTO toDto(Recharge s);

    @Mapping(target = "removeOperateur", ignore = true)
    Recharge toEntity(RechargeDTO rechargeDTO);

    @Named("operateurNom")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nom", source = "nom")
    OperateurDTO toDtoOperateurNom(Operateur operateur);

    @Named("operateurNomSet")
    default Set<OperateurDTO> toDtoOperateurNomSet(Set<Operateur> operateur) {
        return operateur.stream().map(this::toDtoOperateurNom).collect(Collectors.toSet());
    }
}
