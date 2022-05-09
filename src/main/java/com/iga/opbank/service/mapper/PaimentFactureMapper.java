package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.PaimentFacture;
import com.iga.opbank.domain.Service;
import com.iga.opbank.service.dto.PaimentFactureDTO;
import com.iga.opbank.service.dto.ServiceDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link PaimentFacture} and its DTO {@link PaimentFactureDTO}.
 */
@Mapper(componentModel = "spring")
public interface PaimentFactureMapper extends EntityMapper<PaimentFactureDTO, PaimentFacture> {
    @Mapping(target = "services", source = "services", qualifiedByName = "serviceNomServiceSet")
    PaimentFactureDTO toDto(PaimentFacture s);

    @Mapping(target = "removeService", ignore = true)
    PaimentFacture toEntity(PaimentFactureDTO paimentFactureDTO);

    @Named("serviceNomService")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "nomService", source = "nomService")
    ServiceDTO toDtoServiceNomService(Service service);

    @Named("serviceNomServiceSet")
    default Set<ServiceDTO> toDtoServiceNomServiceSet(Set<Service> service) {
        return service.stream().map(this::toDtoServiceNomService).collect(Collectors.toSet());
    }
}
