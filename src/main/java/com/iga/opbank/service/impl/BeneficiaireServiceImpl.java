package com.iga.opbank.service.impl;

import com.iga.opbank.domain.Beneficiaire;
import com.iga.opbank.repository.BeneficiaireRepository;
import com.iga.opbank.service.BeneficiaireService;
import com.iga.opbank.service.dto.BeneficiaireDTO;
import com.iga.opbank.service.mapper.BeneficiaireMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Beneficiaire}.
 */
@Service
@Transactional
public class BeneficiaireServiceImpl implements BeneficiaireService {

    private final Logger log = LoggerFactory.getLogger(BeneficiaireServiceImpl.class);

    private final BeneficiaireRepository beneficiaireRepository;

    private final BeneficiaireMapper beneficiaireMapper;

    public BeneficiaireServiceImpl(BeneficiaireRepository beneficiaireRepository, BeneficiaireMapper beneficiaireMapper) {
        this.beneficiaireRepository = beneficiaireRepository;
        this.beneficiaireMapper = beneficiaireMapper;
    }

    @Override
    public BeneficiaireDTO save(BeneficiaireDTO beneficiaireDTO) {
        log.debug("Request to save Beneficiaire : {}", beneficiaireDTO);
        Beneficiaire beneficiaire = beneficiaireMapper.toEntity(beneficiaireDTO);
        beneficiaire = beneficiaireRepository.save(beneficiaire);
        return beneficiaireMapper.toDto(beneficiaire);
    }

    @Override
    public BeneficiaireDTO update(BeneficiaireDTO beneficiaireDTO) {
        log.debug("Request to save Beneficiaire : {}", beneficiaireDTO);
        Beneficiaire beneficiaire = beneficiaireMapper.toEntity(beneficiaireDTO);
        beneficiaire = beneficiaireRepository.save(beneficiaire);
        return beneficiaireMapper.toDto(beneficiaire);
    }

    @Override
    public Optional<BeneficiaireDTO> partialUpdate(BeneficiaireDTO beneficiaireDTO) {
        log.debug("Request to partially update Beneficiaire : {}", beneficiaireDTO);

        return beneficiaireRepository
            .findById(beneficiaireDTO.getId())
            .map(existingBeneficiaire -> {
                beneficiaireMapper.partialUpdate(existingBeneficiaire, beneficiaireDTO);

                return existingBeneficiaire;
            })
            .map(beneficiaireRepository::save)
            .map(beneficiaireMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BeneficiaireDTO> findAll() {
        log.debug("Request to get all Beneficiaires");
        return beneficiaireRepository.findAll().stream().map(beneficiaireMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BeneficiaireDTO> findOne(Long id) {
        log.debug("Request to get Beneficiaire : {}", id);
        return beneficiaireRepository.findById(id).map(beneficiaireMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Beneficiaire : {}", id);
        beneficiaireRepository.deleteById(id);
    }
}
