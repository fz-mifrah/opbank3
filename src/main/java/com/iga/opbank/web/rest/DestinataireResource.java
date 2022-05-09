package com.iga.opbank.web.rest;

import com.iga.opbank.repository.DestinataireRepository;
import com.iga.opbank.service.DestinataireService;
import com.iga.opbank.service.dto.DestinataireDTO;
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
 * REST controller for managing {@link com.iga.opbank.domain.Destinataire}.
 */
@RestController
@RequestMapping("/api")
public class DestinataireResource {

    private final Logger log = LoggerFactory.getLogger(DestinataireResource.class);

    private static final String ENTITY_NAME = "destinataire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DestinataireService destinataireService;

    private final DestinataireRepository destinataireRepository;

    public DestinataireResource(DestinataireService destinataireService, DestinataireRepository destinataireRepository) {
        this.destinataireService = destinataireService;
        this.destinataireRepository = destinataireRepository;
    }

    /**
     * {@code POST  /destinataires} : Create a new destinataire.
     *
     * @param destinataireDTO the destinataireDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new destinataireDTO, or with status {@code 400 (Bad Request)} if the destinataire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/destinataires")
    public ResponseEntity<DestinataireDTO> createDestinataire(@Valid @RequestBody DestinataireDTO destinataireDTO)
        throws URISyntaxException {
        log.debug("REST request to save Destinataire : {}", destinataireDTO);
        if (destinataireDTO.getId() != null) {
            throw new BadRequestAlertException("A new destinataire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DestinataireDTO result = destinataireService.save(destinataireDTO);
        return ResponseEntity
            .created(new URI("/api/destinataires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /destinataires/:id} : Updates an existing destinataire.
     *
     * @param id the id of the destinataireDTO to save.
     * @param destinataireDTO the destinataireDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated destinataireDTO,
     * or with status {@code 400 (Bad Request)} if the destinataireDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the destinataireDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/destinataires/{id}")
    public ResponseEntity<DestinataireDTO> updateDestinataire(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DestinataireDTO destinataireDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Destinataire : {}, {}", id, destinataireDTO);
        if (destinataireDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, destinataireDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!destinataireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DestinataireDTO result = destinataireService.update(destinataireDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, destinataireDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /destinataires/:id} : Partial updates given fields of an existing destinataire, field will ignore if it is null
     *
     * @param id the id of the destinataireDTO to save.
     * @param destinataireDTO the destinataireDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated destinataireDTO,
     * or with status {@code 400 (Bad Request)} if the destinataireDTO is not valid,
     * or with status {@code 404 (Not Found)} if the destinataireDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the destinataireDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/destinataires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DestinataireDTO> partialUpdateDestinataire(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DestinataireDTO destinataireDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Destinataire partially : {}, {}", id, destinataireDTO);
        if (destinataireDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, destinataireDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!destinataireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DestinataireDTO> result = destinataireService.partialUpdate(destinataireDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, destinataireDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /destinataires} : get all the destinataires.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of destinataires in body.
     */
    @GetMapping("/destinataires")
    public List<DestinataireDTO> getAllDestinataires() {
        log.debug("REST request to get all Destinataires");
        return destinataireService.findAll();
    }

    /**
     * {@code GET  /destinataires/:id} : get the "id" destinataire.
     *
     * @param id the id of the destinataireDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the destinataireDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/destinataires/{id}")
    public ResponseEntity<DestinataireDTO> getDestinataire(@PathVariable Long id) {
        log.debug("REST request to get Destinataire : {}", id);
        Optional<DestinataireDTO> destinataireDTO = destinataireService.findOne(id);
        return ResponseUtil.wrapOrNotFound(destinataireDTO);
    }

    /**
     * {@code DELETE  /destinataires/:id} : delete the "id" destinataire.
     *
     * @param id the id of the destinataireDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/destinataires/{id}")
    public ResponseEntity<Void> deleteDestinataire(@PathVariable Long id) {
        log.debug("REST request to delete Destinataire : {}", id);
        destinataireService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
