package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Beneficiaire;
import com.iga.opbank.domain.Virement;
import com.iga.opbank.service.dto.BeneficiaireDTO;
import com.iga.opbank.service.dto.VirementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Beneficiaire} and its DTO {@link BeneficiaireDTO}.
 */
@Mapper(componentModel = "spring")
public interface BeneficiaireMapper extends EntityMapper<BeneficiaireDTO, Beneficiaire> {
    @Mapping(target = "virement", source = "virement", qualifiedByName = "virementId")
    BeneficiaireDTO toDto(Beneficiaire s);

    @Named("virementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    VirementDTO toDtoVirementId(Virement virement);
}
