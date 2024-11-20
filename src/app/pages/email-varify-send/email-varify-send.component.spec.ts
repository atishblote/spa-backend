import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVarifySendComponent } from './email-varify-send.component';

describe('EmailVarifySendComponent', () => {
  let component: EmailVarifySendComponent;
  let fixture: ComponentFixture<EmailVarifySendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailVarifySendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmailVarifySendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
