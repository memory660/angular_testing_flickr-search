import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '../../models/photo';
import { click, findEl } from '../../spec-helpers/element.spec-helper';
import { photo1, photo1Link } from '../../spec-helpers/photo.spec-helper';
import { PhotoItemComponent } from './photo-item.component';

describe('PhotoItemComponent', () => {
  let component: PhotoItemComponent;
  let fixture: ComponentFixture<PhotoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoItemComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoItemComponent);
    component = fixture.componentInstance;
    // initialisation
    component.photo = photo1;
    fixture.detectChanges();
  });

  it('renders a link and a thumbnail', () => {
    // verifier la balise <a...
    const link = findEl(fixture, 'photo-item-link');
    expect(link.properties.href).toBe(photo1Link);

    // verifier la balise <img...
    const img = findEl(fixture, 'photo-item-image');
    expect(img.properties.src).toBe(photo1.url_q);
    expect(img.properties.alt).toBe(photo1.title);
  });

  it('focusses a photo on click', () => {
    let photo: Photo | undefined;

    // on souscrit à un @Output afin de verifier le contenu émit
    // @Output() public focusPhoto = new EventEmitter<Photo>();
    component.focusPhoto.subscribe((otherPhoto: Photo) => {
      photo = otherPhoto;
    });

    // <a  (click)="handleClick($event)"...     est appelé donc execute dans la fonction : this.focusPhoto.emit(this.photo);
    click(fixture, 'photo-item-link');

    // la souscription plus haut reçoit : photo que l'on compare à photo1
    expect(photo).toBe(photo1);
  });

  it('does nothing when the photo is null', () => {
    component.photo = null;
    fixture.detectChanges();

    // verifie qu'une exception est levé car il ne trouve pas la balise <a...
    // <a *ngIf="photo"...
    expect(() => {
      findEl(fixture, 'photo-item-link');
    }).toThrow();
  });
});
