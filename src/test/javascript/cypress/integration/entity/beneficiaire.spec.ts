import { entityItemSelector } from '../../support/commands';
import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Beneficiaire e2e test', () => {
  const beneficiairePageUrl = '/beneficiaire';
  const beneficiairePageUrlPattern = new RegExp('/beneficiaire(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const beneficiaireSample = { nomPrenom: 'Intelligent', numCompte: 71024 };

  let beneficiaire: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/beneficiaires+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/beneficiaires').as('postEntityRequest');
    cy.intercept('DELETE', '/api/beneficiaires/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (beneficiaire) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/beneficiaires/${beneficiaire.id}`,
      }).then(() => {
        beneficiaire = undefined;
      });
    }
  });

  it('Beneficiaires menu should load Beneficiaires page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('beneficiaire');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Beneficiaire').should('exist');
    cy.url().should('match', beneficiairePageUrlPattern);
  });

  describe('Beneficiaire page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(beneficiairePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Beneficiaire page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/beneficiaire/new$'));
        cy.getEntityCreateUpdateHeading('Beneficiaire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', beneficiairePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/beneficiaires',
          body: beneficiaireSample,
        }).then(({ body }) => {
          beneficiaire = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/beneficiaires+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [beneficiaire],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(beneficiairePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Beneficiaire page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('beneficiaire');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', beneficiairePageUrlPattern);
      });

      it('edit button click should load edit Beneficiaire page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Beneficiaire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', beneficiairePageUrlPattern);
      });

      it('last delete button click should delete instance of Beneficiaire', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('beneficiaire').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', beneficiairePageUrlPattern);

        beneficiaire = undefined;
      });
    });
  });

  describe('new Beneficiaire page', () => {
    beforeEach(() => {
      cy.visit(`${beneficiairePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Beneficiaire');
    });

    it('should create an instance of Beneficiaire', () => {
      cy.get(`[data-cy="nomPrenom"]`).type('Associate Soap Port').should('have.value', 'Associate Soap Port');

      cy.get(`[data-cy="numCompte"]`).type('73600').should('have.value', '73600');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        beneficiaire = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', beneficiairePageUrlPattern);
    });
  });
});
