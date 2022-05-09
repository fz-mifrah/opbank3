package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Facture;
import com.iga.opbank.service.dto.FactureDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Facture} and its DTO {@link FactureDTO}.
 */
@Mapper(componentModel = "spring")
public interface FactureMapper extends EntityMapper<FactureDTO, Facture> {}
