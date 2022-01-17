import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FlickrService } from 'src/app/services/flickr.service';

import { findComponent } from '../../spec-helpers/element.spec-helper';
import { photo1, photos } from '../../spec-helpers/photo.spec-helper';
import { FlickrSearchComponent } from './flickr-search.component';

describe('FlickrSearchComponent', () => {
  // le composant hote (1)
  let fixture: ComponentFixture<FlickrSearchComponent>;

  // un faux service (2)
  let fakeFlickrService: Pick<FlickrService, keyof FlickrService>; // En utilisant Pick et keyof, nous créons un type dérivé qui ne contient que les membres public

  // les composants du fichier .html (3)
  let searchForm: DebugElement;
  let photoList: DebugElement;

  // ne sert pas ici
  let component: FlickrSearchComponent; // accéder aux éléments du `DOM`

  beforeEach(async () => {
    // (2) faux service -> simuler la fonction searchPublicPhotos(...)
    fakeFlickrService = {
      searchPublicPhotos: jasmine
        .createSpy('searchPublicPhotos')
        .and.returnValue(of(photos)),
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [FlickrSearchComponent],
      providers: [{ provide: FlickrService, useValue: fakeFlickrService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlickrSearchComponent); // (1)
    // ne sert pas ici
    component = fixture.debugElement.componentInstance;
    // Re-render the Component
    fixture.detectChanges();
    // chercher les composants dans le DOM du hote
    searchForm = findComponent(fixture, 'app-search-form'); // (3)
    photoList = findComponent(fixture, 'app-photo-list'); // (3)
  });

  it('rend le formulaire de recherche et la liste des photos, et non la photo complète', () => {
    // verifier le 1er affichage, à l'initialisation
    expect(searchForm).toBeTruthy();
    expect(photoList).toBeTruthy();
    expect(photoList.properties.title).toBe('');
    expect(photoList.properties.photos).toEqual([]);

    expect(() => {
      findComponent(fixture, 'app-full-photo');
    }).toThrow();
  });

  it('recherche et transmet les photos résultantes à la liste de photos', () => {
    // le champ de recherche
    const searchTerm = 'beautiful flowers';
    searchForm.triggerEventHandler('search', searchTerm); // <app-search-form (search)=...
    fixture.detectChanges();

    // verifier les conséquences sur la recherche
    expect(fakeFlickrService.searchPublicPhotos).toHaveBeenCalledWith(searchTerm); // fakeFlickrService.searchPublicPhotos() est appelé ?
    expect(photoList.properties.title).toBe(searchTerm);
    expect(photoList.properties.photos).toBe(photos);
  });

  it("rend la photo complète lorsqu'une photo a le focus", () => {
    expect(() => {
      findComponent(fixture, 'app-full-photo');
    }).toThrow();

    // clic sur une photo
    photoList.triggerEventHandler('focusPhoto', photo1); // <app-photo-list  (focusPhoto)=...
    fixture.detectChanges();

    // verifier les conséquences
    const fullPhoto = findComponent(fixture, 'app-full-photo');
    expect(fullPhoto.properties.photo).toBe(photo1);
  });
});
