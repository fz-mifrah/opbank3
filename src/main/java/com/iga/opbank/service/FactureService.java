package com.iga.opbank.service;

import com.iga.opbank.service.dto.FactureDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.iga.opbank.domain.Facture}.
 */
public interface FactureService {
    /**
     * Save a facture.
     *
     * @param factureDTO the entity to save.
     * @return the persisted entity.
     */
    FactureDTO save(FactureDTO factureDTO);

    /**
     * Updates a facture.
     *
     * @param factureDTO the entity to update.
     * @return the persisted entity.
     */
    FactureDTO update(FactureDTO factureDTO);

    /**
     * Partially updates a facture.
     *
     * @param factureDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FactureDTO> partialUpdate(FactureDTO factureDTO);

    /**
     * Get all the factures.
     *
     * @return the list of entities.
     */
    List<FactureDTO> findAll();

    /**
     * Get the "id" facture.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FactureDTO> findOne(Long id);

    /**
     * Delete the "id" facture.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
