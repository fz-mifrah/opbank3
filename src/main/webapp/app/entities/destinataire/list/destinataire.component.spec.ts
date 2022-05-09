import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DestinataireService } from '../service/destinataire.service';

import { DestinataireComponent } from './destinataire.component';

describe('Destinataire Management Component', () => {
  let comp: DestinataireComponent;
  let fixture: ComponentFixture<DestinataireComponent>;
  let service: DestinataireService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DestinataireComponent],
    })
      .overrideTemplate(DestinataireComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DestinataireComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DestinataireService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.destinataires?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
