import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicOptionsComponent } from './dynamic-options.component';

describe('DynamicOptionsComponent', () => {
  let component: DynamicOptionsComponent;
  let fixture: ComponentFixture<DynamicOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicOptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
