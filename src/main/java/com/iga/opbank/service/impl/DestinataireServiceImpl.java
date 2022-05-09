package com.iga.opbank.service.impl;

import com.iga.opbank.domain.Destinataire;
import com.iga.opbank.repository.DestinataireRepository;
import com.iga.opbank.service.DestinataireService;
import com.iga.opbank.service.dto.DestinataireDTO;
import com.iga.opbank.service.mapper.DestinataireMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Destinataire}.
 */
@Service
@Transactional
public class DestinataireServiceImpl implements DestinataireService {

    private final Logger log = LoggerFactory.getLogger(DestinataireServiceImpl.class);

    private final DestinataireRepository destinataireRepository;

    private final DestinataireMapper destinataireMapper;

    public DestinataireServiceImpl(DestinataireRepository destinataireRepository, DestinataireMapper destinataireMapper) {
        this.destinataireRepository = destinataireRepository;
        this.destinataireMapper = destinataireMapper;
    }

    @Override
    public DestinataireDTO save(DestinataireDTO destinataireDTO) {
        log.debug("Request to save Destinataire : {}", destinataireDTO);
        Destinataire destinataire = destinataireMapper.toEntity(destinataireDTO);
        destinataire = destinataireRepository.save(destinataire);
        return destinataireMapper.toDto(destinataire);
    }

    @Override
    public DestinataireDTO update(DestinataireDTO destinataireDTO) {
        log.debug("Request to save Destinataire : {}", destinataireDTO);
        Destinataire destinataire = destinataireMapper.toEntity(destinataireDTO);
        destinataire = destinataireRepository.save(destinataire);
        return destinataireMapper.toDto(destinataire);
    }

    @Override
    public Optional<DestinataireDTO> partialUpdate(DestinataireDTO destinataireDTO) {
        log.debug("Request to partially update Destinataire : {}", destinataireDTO);

        return destinataireRepository
            .findById(destinataireDTO.getId())
            .map(existingDestinataire -> {
                destinataireMapper.partialUpdate(existingDestinataire, destinataireDTO);

                return existingDestinataire;
            })
            .map(destinataireRepository::save)
            .map(destinataireMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DestinataireDTO> findAll() {
        log.debug("Request to get all Destinataires");
        return destinataireRepository.findAll().stream().map(destinataireMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DestinataireDTO> findOne(Long id) {
        log.debug("Request to get Destinataire : {}", id);
        return destinataireRepository.findById(id).map(destinataireMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Destinataire : {}", id);
        destinataireRepository.deleteById(id);
    }
}
