import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCanvasComponent } from './main-canvas.component';

describe('MainCanvasComponent', () => {
  let component: MainCanvasComponent;
  let fixture: ComponentFixture<MainCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
