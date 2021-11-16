// insertion point sub template for components imports 
  import { CountrySpecsTableComponent } from './countryspecs-table/countryspecs-table.component'
  import { CountrySpecSortingComponent } from './countryspec-sorting/countryspec-sorting.component'
  import { CountryWithBodiessTableComponent } from './countrywithbodiess-table/countrywithbodiess-table.component'
  import { CountryWithBodiesSortingComponent } from './countrywithbodies-sorting/countrywithbodies-sorting.component'

// insertion point sub template for map of components per struct 
  export const MapOfCountrySpecsComponents: Map<string, any> = new Map([["CountrySpecsTableComponent", CountrySpecsTableComponent],])
  export const MapOfCountrySpecSortingComponents: Map<string, any> = new Map([["CountrySpecSortingComponent", CountrySpecSortingComponent],])
  export const MapOfCountryWithBodiessComponents: Map<string, any> = new Map([["CountryWithBodiessTableComponent", CountryWithBodiessTableComponent],])
  export const MapOfCountryWithBodiesSortingComponents: Map<string, any> = new Map([["CountryWithBodiesSortingComponent", CountryWithBodiesSortingComponent],])

// map of all ng components of the stacks
export const MapOfComponents: Map<string, any> =
  new Map(
    [
      // insertion point sub template for map of components 
      ["CountrySpec", MapOfCountrySpecsComponents],
      ["CountryWithBodies", MapOfCountryWithBodiessComponents],
    ]
  )

// map of all ng components of the stacks
export const MapOfSortingComponents: Map<string, any> =
  new Map(
    [
    // insertion point sub template for map of sorting components 
      ["CountrySpec", MapOfCountrySpecSortingComponents],
      ["CountryWithBodies", MapOfCountryWithBodiesSortingComponents],
    ]
  )
