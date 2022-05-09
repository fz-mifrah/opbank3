package com.iga.opbank.service;

import com.iga.opbank.service.dto.DestinataireDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.iga.opbank.domain.Destinataire}.
 */
public interface DestinataireService {
    /**
     * Save a destinataire.
     *
     * @param destinataireDTO the entity to save.
     * @return the persisted entity.
     */
    DestinataireDTO save(DestinataireDTO destinataireDTO);

    /**
     * Updates a destinataire.
     *
     * @param destinataireDTO the entity to update.
     * @return the persisted entity.
     */
    DestinataireDTO update(DestinataireDTO destinataireDTO);

    /**
     * Partially updates a destinataire.
     *
     * @param destinataireDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DestinataireDTO> partialUpdate(DestinataireDTO destinataireDTO);

    /**
     * Get all the destinataires.
     *
     * @return the list of entities.
     */
    List<DestinataireDTO> findAll();

    /**
     * Get the "id" destinataire.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<DestinataireDTO> findOne(Long id);

    /**
     * Delete the "id" destinataire.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
