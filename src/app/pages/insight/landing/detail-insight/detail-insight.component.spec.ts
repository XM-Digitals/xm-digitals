import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInsightComponent } from './detail-insight.component';

describe('DetailInsightComponent', () => {
  let component: DetailInsightComponent;
  let fixture: ComponentFixture<DetailInsightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInsightComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
