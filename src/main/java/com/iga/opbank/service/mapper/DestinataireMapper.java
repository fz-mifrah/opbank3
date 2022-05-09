package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Destinataire;
import com.iga.opbank.domain.Virement;
import com.iga.opbank.service.dto.DestinataireDTO;
import com.iga.opbank.service.dto.VirementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Destinataire} and its DTO {@link DestinataireDTO}.
 */
@Mapper(componentModel = "spring")
public interface DestinataireMapper extends EntityMapper<DestinataireDTO, Destinataire> {
    @Mapping(target = "virement", source = "virement", qualifiedByName = "virementId")
    DestinataireDTO toDto(Destinataire s);

    @Named("virementId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    VirementDTO toDtoVirementId(Virement virement);
}
