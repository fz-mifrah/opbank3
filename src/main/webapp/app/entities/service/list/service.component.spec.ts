import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ServiceService } from '../service/service.service';

import { ServiceComponent } from './service.component';

describe('Service Management Component', () => {
  let comp: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;
  let service: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ServiceComponent],
    })
      .overrideTemplate(ServiceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ServiceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ServiceService);

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
    expect(comp.services?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
