package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Destinataire;
import com.iga.opbank.service.dto.DestinataireDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Destinataire} and its DTO {@link DestinataireDTO}.
 */
@Mapper(componentModel = "spring")
public interface DestinataireMapper extends EntityMapper<DestinataireDTO, Destinataire> {}
