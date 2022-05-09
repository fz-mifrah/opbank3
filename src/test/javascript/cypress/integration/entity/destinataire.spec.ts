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

describe('Destinataire e2e test', () => {
  const destinatairePageUrl = '/destinataire';
  const destinatairePageUrlPattern = new RegExp('/destinataire(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const destinataireSample = { nom: 'Senegal Metrics', prenom: 'blue convergence', rib: 87055 };

  let destinataire: any;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/destinataires+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/destinataires').as('postEntityRequest');
    cy.intercept('DELETE', '/api/destinataires/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (destinataire) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/destinataires/${destinataire.id}`,
      }).then(() => {
        destinataire = undefined;
      });
    }
  });

  it('Destinataires menu should load Destinataires page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('destinataire');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response!.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Destinataire').should('exist');
    cy.url().should('match', destinatairePageUrlPattern);
  });

  describe('Destinataire page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(destinatairePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Destinataire page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/destinataire/new$'));
        cy.getEntityCreateUpdateHeading('Destinataire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', destinatairePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/destinataires',
          body: destinataireSample,
        }).then(({ body }) => {
          destinataire = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/destinataires+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [destinataire],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(destinatairePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Destinataire page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('destinataire');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', destinatairePageUrlPattern);
      });

      it('edit button click should load edit Destinataire page', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Destinataire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', destinatairePageUrlPattern);
      });

      it('last delete button click should delete instance of Destinataire', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('destinataire').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response!.statusCode).to.equal(200);
        });
        cy.url().should('match', destinatairePageUrlPattern);

        destinataire = undefined;
      });
    });
  });

  describe('new Destinataire page', () => {
    beforeEach(() => {
      cy.visit(`${destinatairePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Destinataire');
    });

    it('should create an instance of Destinataire', () => {
      cy.get(`[data-cy="nom"]`).type('Beauty generation Bhutanese').should('have.value', 'Beauty generation Bhutanese');

      cy.get(`[data-cy="prenom"]`).type('Iran').should('have.value', 'Iran');

      cy.get(`[data-cy="rib"]`).type('42916').should('have.value', '42916');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(201);
        destinataire = response!.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response!.statusCode).to.equal(200);
      });
      cy.url().should('match', destinatairePageUrlPattern);
    });
  });
});
