package com.iga.opbank.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iga.opbank.IntegrationTest;
import com.iga.opbank.domain.Service;
import com.iga.opbank.repository.ServiceRepository;
import com.iga.opbank.service.dto.ServiceDTO;
import com.iga.opbank.service.mapper.ServiceMapper;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ServiceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ServiceResourceIT {

    private static final String DEFAULT_NOM_SERVICE = "AAAAAAAAAA";
    private static final String UPDATED_NOM_SERVICE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ServiceMapper serviceMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restServiceMockMvc;

    private Service service;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Service createEntity(EntityManager em) {
        Service service = new Service().nomService(DEFAULT_NOM_SERVICE);
        return service;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Service createUpdatedEntity(EntityManager em) {
        Service service = new Service().nomService(UPDATED_NOM_SERVICE);
        return service;
    }

    @BeforeEach
    public void initTest() {
        service = createEntity(em);
    }

    @Test
    @Transactional
    void createService() throws Exception {
        int databaseSizeBeforeCreate = serviceRepository.findAll().size();
        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);
        restServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceDTO)))
            .andExpect(status().isCreated());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeCreate + 1);
        Service testService = serviceList.get(serviceList.size() - 1);
        assertThat(testService.getNomService()).isEqualTo(DEFAULT_NOM_SERVICE);
    }

    @Test
    @Transactional
    void createServiceWithExistingId() throws Exception {
        // Create the Service with an existing ID
        service.setId(1L);
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        int databaseSizeBeforeCreate = serviceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomServiceIsRequired() throws Exception {
        int databaseSizeBeforeTest = serviceRepository.findAll().size();
        // set the field null
        service.setNomService(null);

        // Create the Service, which fails.
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        restServiceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceDTO)))
            .andExpect(status().isBadRequest());

        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllServices() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        // Get all the serviceList
        restServiceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(service.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomService").value(hasItem(DEFAULT_NOM_SERVICE)));
    }

    @Test
    @Transactional
    void getService() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        // Get the service
        restServiceMockMvc
            .perform(get(ENTITY_API_URL_ID, service.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(service.getId().intValue()))
            .andExpect(jsonPath("$.nomService").value(DEFAULT_NOM_SERVICE));
    }

    @Test
    @Transactional
    void getNonExistingService() throws Exception {
        // Get the service
        restServiceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewService() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();

        // Update the service
        Service updatedService = serviceRepository.findById(service.getId()).get();
        // Disconnect from session so that the updates on updatedService are not directly saved in db
        em.detach(updatedService);
        updatedService.nomService(UPDATED_NOM_SERVICE);
        ServiceDTO serviceDTO = serviceMapper.toDto(updatedService);

        restServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isOk());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
        Service testService = serviceList.get(serviceList.size() - 1);
        assertThat(testService.getNomService()).isEqualTo(UPDATED_NOM_SERVICE);
    }

    @Test
    @Transactional
    void putNonExistingService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, serviceDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(serviceDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateServiceWithPatch() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();

        // Update the service using partial update
        Service partialUpdatedService = new Service();
        partialUpdatedService.setId(service.getId());

        restServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedService))
            )
            .andExpect(status().isOk());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
        Service testService = serviceList.get(serviceList.size() - 1);
        assertThat(testService.getNomService()).isEqualTo(DEFAULT_NOM_SERVICE);
    }

    @Test
    @Transactional
    void fullUpdateServiceWithPatch() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();

        // Update the service using partial update
        Service partialUpdatedService = new Service();
        partialUpdatedService.setId(service.getId());

        partialUpdatedService.nomService(UPDATED_NOM_SERVICE);

        restServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedService.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedService))
            )
            .andExpect(status().isOk());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
        Service testService = serviceList.get(serviceList.size() - 1);
        assertThat(testService.getNomService()).isEqualTo(UPDATED_NOM_SERVICE);
    }

    @Test
    @Transactional
    void patchNonExistingService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, serviceDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamService() throws Exception {
        int databaseSizeBeforeUpdate = serviceRepository.findAll().size();
        service.setId(count.incrementAndGet());

        // Create the Service
        ServiceDTO serviceDTO = serviceMapper.toDto(service);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restServiceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(serviceDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Service in the database
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteService() throws Exception {
        // Initialize the database
        serviceRepository.saveAndFlush(service);

        int databaseSizeBeforeDelete = serviceRepository.findAll().size();

        // Delete the service
        restServiceMockMvc
            .perform(delete(ENTITY_API_URL_ID, service.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Service> serviceList = serviceRepository.findAll();
        assertThat(serviceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
