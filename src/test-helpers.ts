import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, EMPTY } from 'rxjs';

@Component({ template: '' })
export class MockComponent { }

export function setupTestBedWithRouter(routeParams: any = {}) {
  const routerSpy = jasmine.createSpyObj('Router', [
    'navigate', 
    'navigateByUrl', 
    'createUrlTree', 
    'serializeUrl',
    'parseUrl',
    'isActive'
  ], {
    events: EMPTY // Observable vacío para eventos del router
  });
  
  // Mock para métodos del router
  routerSpy.serializeUrl.and.returnValue('/mock-url');
  routerSpy.parseUrl.and.returnValue({ 
    toString: () => '/mock-url',
    root: { children: {} }
  });
  routerSpy.createUrlTree.and.returnValue({ 
    toString: () => '/mock-url',
    root: { children: {} }
  });
  routerSpy.isActive.and.returnValue(false);
  
  const locationSpy = jasmine.createSpyObj('Location', ['back', 'forward', 'path']);
  
  // Mock más completo para ActivatedRoute
  const activatedRouteMock = {
    params: of(routeParams),
    queryParams: of({}),
    snapshot: {
      params: routeParams,
      queryParams: {},
      paramMap: {
        get: (key: string) => routeParams[key] || null,
        has: (key: string) => key in routeParams
      },
      queryParamMap: {
        get: () => null,
        has: () => false
      }
    },
    paramMap: of({
      get: (key: string) => routeParams[key] || null,
      has: (key: string) => key in routeParams
    }),
    queryParamMap: of({
      get: () => null,
      has: () => false
    })
  };

  return {
    providers: [
      provideRouter([]),
      { provide: Router, useValue: routerSpy },
      { provide: Location, useValue: locationSpy },
      { provide: ActivatedRoute, useValue: activatedRouteMock }
    ],
    routerSpy,
    locationSpy,
    activatedRouteMock
  };
}
