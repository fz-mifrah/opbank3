package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Virement;
import com.iga.opbank.service.dto.VirementDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Virement} and its DTO {@link VirementDTO}.
 */
@Mapper(componentModel = "spring")
public interface VirementMapper extends EntityMapper<VirementDTO, Virement> {}
