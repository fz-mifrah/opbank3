package com.iga.opbank.web.rest;

import com.iga.opbank.repository.BeneficiaireRepository;
import com.iga.opbank.service.BeneficiaireService;
import com.iga.opbank.service.dto.BeneficiaireDTO;
import com.iga.opbank.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.iga.opbank.domain.Beneficiaire}.
 */
@RestController
@RequestMapping("/api")
public class BeneficiaireResource {

    private final Logger log = LoggerFactory.getLogger(BeneficiaireResource.class);

    private static final String ENTITY_NAME = "beneficiaire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final BeneficiaireService beneficiaireService;

    private final BeneficiaireRepository beneficiaireRepository;

    public BeneficiaireResource(BeneficiaireService beneficiaireService, BeneficiaireRepository beneficiaireRepository) {
        this.beneficiaireService = beneficiaireService;
        this.beneficiaireRepository = beneficiaireRepository;
    }

    /**
     * {@code POST  /beneficiaires} : Create a new beneficiaire.
     *
     * @param beneficiaireDTO the beneficiaireDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new beneficiaireDTO, or with status {@code 400 (Bad Request)} if the beneficiaire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/beneficiaires")
    public ResponseEntity<BeneficiaireDTO> createBeneficiaire(@Valid @RequestBody BeneficiaireDTO beneficiaireDTO)
        throws URISyntaxException {
        log.debug("REST request to save Beneficiaire : {}", beneficiaireDTO);
        if (beneficiaireDTO.getId() != null) {
            throw new BadRequestAlertException("A new beneficiaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BeneficiaireDTO result = beneficiaireService.save(beneficiaireDTO);
        return ResponseEntity
            .created(new URI("/api/beneficiaires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /beneficiaires/:id} : Updates an existing beneficiaire.
     *
     * @param id the id of the beneficiaireDTO to save.
     * @param beneficiaireDTO the beneficiaireDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beneficiaireDTO,
     * or with status {@code 400 (Bad Request)} if the beneficiaireDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the beneficiaireDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/beneficiaires/{id}")
    public ResponseEntity<BeneficiaireDTO> updateBeneficiaire(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody BeneficiaireDTO beneficiaireDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Beneficiaire : {}, {}", id, beneficiaireDTO);
        if (beneficiaireDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beneficiaireDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beneficiaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        BeneficiaireDTO result = beneficiaireService.update(beneficiaireDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, beneficiaireDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /beneficiaires/:id} : Partial updates given fields of an existing beneficiaire, field will ignore if it is null
     *
     * @param id the id of the beneficiaireDTO to save.
     * @param beneficiaireDTO the beneficiaireDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated beneficiaireDTO,
     * or with status {@code 400 (Bad Request)} if the beneficiaireDTO is not valid,
     * or with status {@code 404 (Not Found)} if the beneficiaireDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the beneficiaireDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/beneficiaires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<BeneficiaireDTO> partialUpdateBeneficiaire(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody BeneficiaireDTO beneficiaireDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Beneficiaire partially : {}, {}", id, beneficiaireDTO);
        if (beneficiaireDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, beneficiaireDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!beneficiaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<BeneficiaireDTO> result = beneficiaireService.partialUpdate(beneficiaireDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, beneficiaireDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /beneficiaires} : get all the beneficiaires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of beneficiaires in body.
     */
    @GetMapping("/beneficiaires")
    public List<BeneficiaireDTO> getAllBeneficiaires() {
        log.debug("REST request to get all Beneficiaires");
        return beneficiaireService.findAll();
    }

    /**
     * {@code GET  /beneficiaires/:id} : get the "id" beneficiaire.
     *
     * @param id the id of the beneficiaireDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the beneficiaireDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/beneficiaires/{id}")
    public ResponseEntity<BeneficiaireDTO> getBeneficiaire(@PathVariable Long id) {
        log.debug("REST request to get Beneficiaire : {}", id);
        Optional<BeneficiaireDTO> beneficiaireDTO = beneficiaireService.findOne(id);
        return ResponseUtil.wrapOrNotFound(beneficiaireDTO);
    }

    /**
     * {@code DELETE  /beneficiaires/:id} : delete the "id" beneficiaire.
     *
     * @param id the id of the beneficiaireDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/beneficiaires/{id}")
    public ResponseEntity<Void> deleteBeneficiaire(@PathVariable Long id) {
        log.debug("REST request to delete Beneficiaire : {}", id);
        beneficiaireService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
