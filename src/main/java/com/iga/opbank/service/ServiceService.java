package com.iga.opbank.service;

import com.iga.opbank.service.dto.ServiceDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.iga.opbank.domain.Service}.
 */
public interface ServiceService {
    /**
     * Save a service.
     *
     * @param serviceDTO the entity to save.
     * @return the persisted entity.
     */
    ServiceDTO save(ServiceDTO serviceDTO);

    /**
     * Updates a service.
     *
     * @param serviceDTO the entity to update.
     * @return the persisted entity.
     */
    ServiceDTO update(ServiceDTO serviceDTO);

    /**
     * Partially updates a service.
     *
     * @param serviceDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<ServiceDTO> partialUpdate(ServiceDTO serviceDTO);

    /**
     * Get all the services.
     *
     * @return the list of entities.
     */
    List<ServiceDTO> findAll();

    /**
     * Get the "id" service.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ServiceDTO> findOne(Long id);

    /**
     * Delete the "id" service.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
