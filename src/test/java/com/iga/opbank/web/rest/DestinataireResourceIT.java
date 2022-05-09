package com.iga.opbank.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.iga.opbank.IntegrationTest;
import com.iga.opbank.domain.Destinataire;
import com.iga.opbank.repository.DestinataireRepository;
import com.iga.opbank.service.dto.DestinataireDTO;
import com.iga.opbank.service.mapper.DestinataireMapper;
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
 * Integration tests for the {@link DestinataireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DestinataireResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final Long DEFAULT_RIB = 1L;
    private static final Long UPDATED_RIB = 2L;

    private static final String ENTITY_API_URL = "/api/destinataires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DestinataireRepository destinataireRepository;

    @Autowired
    private DestinataireMapper destinataireMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDestinataireMockMvc;

    private Destinataire destinataire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Destinataire createEntity(EntityManager em) {
        Destinataire destinataire = new Destinataire().nom(DEFAULT_NOM).prenom(DEFAULT_PRENOM).rib(DEFAULT_RIB);
        return destinataire;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Destinataire createUpdatedEntity(EntityManager em) {
        Destinataire destinataire = new Destinataire().nom(UPDATED_NOM).prenom(UPDATED_PRENOM).rib(UPDATED_RIB);
        return destinataire;
    }

    @BeforeEach
    public void initTest() {
        destinataire = createEntity(em);
    }

    @Test
    @Transactional
    void createDestinataire() throws Exception {
        int databaseSizeBeforeCreate = destinataireRepository.findAll().size();
        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);
        restDestinataireMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isCreated());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeCreate + 1);
        Destinataire testDestinataire = destinataireList.get(destinataireList.size() - 1);
        assertThat(testDestinataire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testDestinataire.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testDestinataire.getRib()).isEqualTo(DEFAULT_RIB);
    }

    @Test
    @Transactional
    void createDestinataireWithExistingId() throws Exception {
        // Create the Destinataire with an existing ID
        destinataire.setId(1L);
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        int databaseSizeBeforeCreate = destinataireRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDestinataireMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomIsRequired() throws Exception {
        int databaseSizeBeforeTest = destinataireRepository.findAll().size();
        // set the field null
        destinataire.setNom(null);

        // Create the Destinataire, which fails.
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        restDestinataireMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrenomIsRequired() throws Exception {
        int databaseSizeBeforeTest = destinataireRepository.findAll().size();
        // set the field null
        destinataire.setPrenom(null);

        // Create the Destinataire, which fails.
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        restDestinataireMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkRibIsRequired() throws Exception {
        int databaseSizeBeforeTest = destinataireRepository.findAll().size();
        // set the field null
        destinataire.setRib(null);

        // Create the Destinataire, which fails.
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        restDestinataireMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDestinataires() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        // Get all the destinataireList
        restDestinataireMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(destinataire.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].rib").value(hasItem(DEFAULT_RIB.intValue())));
    }

    @Test
    @Transactional
    void getDestinataire() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        // Get the destinataire
        restDestinataireMockMvc
            .perform(get(ENTITY_API_URL_ID, destinataire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(destinataire.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.rib").value(DEFAULT_RIB.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingDestinataire() throws Exception {
        // Get the destinataire
        restDestinataireMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDestinataire() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();

        // Update the destinataire
        Destinataire updatedDestinataire = destinataireRepository.findById(destinataire.getId()).get();
        // Disconnect from session so that the updates on updatedDestinataire are not directly saved in db
        em.detach(updatedDestinataire);
        updatedDestinataire.nom(UPDATED_NOM).prenom(UPDATED_PRENOM).rib(UPDATED_RIB);
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(updatedDestinataire);

        restDestinataireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, destinataireDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isOk());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
        Destinataire testDestinataire = destinataireList.get(destinataireList.size() - 1);
        assertThat(testDestinataire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDestinataire.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testDestinataire.getRib()).isEqualTo(UPDATED_RIB);
    }

    @Test
    @Transactional
    void putNonExistingDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, destinataireDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDestinataireWithPatch() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();

        // Update the destinataire using partial update
        Destinataire partialUpdatedDestinataire = new Destinataire();
        partialUpdatedDestinataire.setId(destinataire.getId());

        partialUpdatedDestinataire.prenom(UPDATED_PRENOM);

        restDestinataireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDestinataire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDestinataire))
            )
            .andExpect(status().isOk());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
        Destinataire testDestinataire = destinataireList.get(destinataireList.size() - 1);
        assertThat(testDestinataire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testDestinataire.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testDestinataire.getRib()).isEqualTo(DEFAULT_RIB);
    }

    @Test
    @Transactional
    void fullUpdateDestinataireWithPatch() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();

        // Update the destinataire using partial update
        Destinataire partialUpdatedDestinataire = new Destinataire();
        partialUpdatedDestinataire.setId(destinataire.getId());

        partialUpdatedDestinataire.nom(UPDATED_NOM).prenom(UPDATED_PRENOM).rib(UPDATED_RIB);

        restDestinataireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDestinataire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDestinataire))
            )
            .andExpect(status().isOk());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
        Destinataire testDestinataire = destinataireList.get(destinataireList.size() - 1);
        assertThat(testDestinataire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testDestinataire.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testDestinataire.getRib()).isEqualTo(UPDATED_RIB);
    }

    @Test
    @Transactional
    void patchNonExistingDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, destinataireDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDestinataire() throws Exception {
        int databaseSizeBeforeUpdate = destinataireRepository.findAll().size();
        destinataire.setId(count.incrementAndGet());

        // Create the Destinataire
        DestinataireDTO destinataireDTO = destinataireMapper.toDto(destinataire);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDestinataireMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(destinataireDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Destinataire in the database
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDestinataire() throws Exception {
        // Initialize the database
        destinataireRepository.saveAndFlush(destinataire);

        int databaseSizeBeforeDelete = destinataireRepository.findAll().size();

        // Delete the destinataire
        restDestinataireMockMvc
            .perform(delete(ENTITY_API_URL_ID, destinataire.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Destinataire> destinataireList = destinataireRepository.findAll();
        assertThat(destinataireList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
