package com.iga.opbank.service.mapper;

import com.iga.opbank.domain.Beneficiaire;
import com.iga.opbank.service.dto.BeneficiaireDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Beneficiaire} and its DTO {@link BeneficiaireDTO}.
 */
@Mapper(componentModel = "spring")
public interface BeneficiaireMapper extends EntityMapper<BeneficiaireDTO, Beneficiaire> {}
