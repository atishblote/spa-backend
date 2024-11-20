import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VarificationComponent } from './varification.component';

describe('VarificationComponent', () => {
  let component: VarificationComponent;
  let fixture: ComponentFixture<VarificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VarificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VarificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
