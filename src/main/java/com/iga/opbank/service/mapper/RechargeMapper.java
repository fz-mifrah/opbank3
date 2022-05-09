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
    @Mapping(target = "operateurs", source = "operateurs", qualifiedByName = "operateurNomOpSet")
    RechargeDTO toDto(Recharge s);

    @Mapping(target = "removeOperateur", ignore = true)
    Recharge toEntity(RechargeDTO rechargeDTO);

    @Named("operateurNomOp")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nomOp", source = "nomOp")
    OperateurDTO toDtoOperateurNomOp(Operateur operateur);

    @Named("operateurNomOpSet")
    default Set<OperateurDTO> toDtoOperateurNomOpSet(Set<Operateur> operateur) {
        return operateur.stream().map(this::toDtoOperateurNomOp).collect(Collectors.toSet());
    }
}
