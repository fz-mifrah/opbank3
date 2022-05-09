package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Beneficiaire;
import com.iga.opbank.domain.Destinataire;
import com.iga.opbank.domain.Virement;
import com.iga.opbank.service.dto.BeneficiaireDTO;
import com.iga.opbank.service.dto.DestinataireDTO;
import com.iga.opbank.service.dto.VirementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Virement} and its DTO {@link VirementDTO}.
 */
@Mapper(componentModel = "spring")
public interface VirementMapper extends EntityMapper<VirementDTO, Virement> {
    @Mapping(target = "destinataire", source = "destinataire", qualifiedByName = "destinataireNom")
    @Mapping(target = "beneficiaire", source = "beneficiaire", qualifiedByName = "beneficiaireNomPrenom")
    VirementDTO toDto(Virement s);

    @Named("destinataireNom")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nom", source = "nom")
    DestinataireDTO toDtoDestinataireNom(Destinataire destinataire);

    @Named("beneficiaireNomPrenom")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nomPrenom", source = "nomPrenom")
    BeneficiaireDTO toDtoBeneficiaireNomPrenom(Beneficiaire beneficiaire);
}
