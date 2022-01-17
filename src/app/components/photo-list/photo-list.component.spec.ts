import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Photo } from '../../models/photo';
import {
  expectText,
  findComponent,
  findComponents,
} from '../../spec-helpers/element.spec-helper';
import { photo1, photo2 } from '../../spec-helpers/photo.spec-helper';
import { PhotoListComponent } from './photo-list.component';

const title = 'Hello World';
const photos = [photo1, photo2];
1;

describe('PhotoListComponent', () => {
  let component: PhotoListComponent;
  let fixture: ComponentFixture<PhotoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhotoListComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoListComponent);
    component = fixture.componentInstance;
    // initialisation
    component.title = title;
    component.photos = photos; // (1)
    fixture.detectChanges();
  });

  it('renders the title', () => {
    // verifie le contenu d'une balise
    expectText(fixture, 'photo-list-title', title);
  });

  it('renders photo items', () => {
    // verification du composant : <app-photo-item *ngFor="...
    const photoItems = findComponents(fixture, 'app-photo-item');
    // verification du nombre de composant
    expect(photoItems.length).toBe(photos.length);
    // verification de la photo transmis à chaque composant
    photoItems.forEach((photoItem, i) => {
      expect(photoItem.properties.photo).toBe(photos[i]);
    });
  });

  it('focusses a photo', () => {
    // le 1er app-photo-item qui correspond à : photo1   (1)
    const photoItem = findComponent(fixture, 'app-photo-item');

    let photo: Photo | undefined;

    component.focusPhoto.subscribe((otherPhoto: Photo) => {
      photo = otherPhoto;
    });

    // dans le composant : photo-item, sur le @Output focusPhoto... -> déclenche : this.focusPhoto.emit(this.photo);
    photoItem.triggerEventHandler('focusPhoto', photoItem.properties.photo);

    // la photo reçut dans la souscription doit etre la photo1
    expect(photo).toBe(photo1); // (1)
  });
});
