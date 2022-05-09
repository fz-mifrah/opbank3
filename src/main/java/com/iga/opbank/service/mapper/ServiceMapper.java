package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Service;
import com.iga.opbank.service.dto.ServiceDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Service} and its DTO {@link ServiceDTO}.
 */
@Mapper(componentModel = "spring")
public interface ServiceMapper extends EntityMapper<ServiceDTO, Service> {}
