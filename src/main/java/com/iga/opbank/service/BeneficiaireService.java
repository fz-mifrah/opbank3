package com.iga.opbank.service;

import com.iga.opbank.service.dto.BeneficiaireDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.iga.opbank.domain.Beneficiaire}.
 */
public interface BeneficiaireService {
    /**
     * Save a beneficiaire.
     *
     * @param beneficiaireDTO the entity to save.
     * @return the persisted entity.
     */
    BeneficiaireDTO save(BeneficiaireDTO beneficiaireDTO);

    /**
     * Updates a beneficiaire.
     *
     * @param beneficiaireDTO the entity to update.
     * @return the persisted entity.
     */
    BeneficiaireDTO update(BeneficiaireDTO beneficiaireDTO);

    /**
     * Partially updates a beneficiaire.
     *
     * @param beneficiaireDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<BeneficiaireDTO> partialUpdate(BeneficiaireDTO beneficiaireDTO);

    /**
     * Get all the beneficiaires.
     *
     * @return the list of entities.
     */
    List<BeneficiaireDTO> findAll();

    /**
     * Get the "id" beneficiaire.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<BeneficiaireDTO> findOne(Long id);

    /**
     * Delete the "id" beneficiaire.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
