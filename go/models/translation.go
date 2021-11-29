package models

import "github.com/tenktenk/translate/go/grump"

// Singloton pointing to the current translation
// the singloton can be autocally initiated if it is nil
var translateCurrent Translation

// storage for all countries
var mapOfCountries map[string]*CountryWithBodies = nil

// Singloton pattern to init the current translation
func GetTranslateCurrent(datastore string) *Translation {

	// check if the current translation is void.
	if mapOfCountries == nil {

		mapOfCountries = make(map[string]*CountryWithBodies)

		// stage the country
		for _, countrySpec := range CountrySpecs {
			country := (&CountryWithBodies{
				Country: grump.Country{
					Name: countrySpec.Name,
				},
				NbBodies: countrySpec.NbBodies,
				Step:     countrySpec.Step,
			}).Stage()

			country.Init(datastore)

			mapOfCountries[country.Name] = country
		}

		translateCurrent.sourceCountry = mapOfCountries["fra"]
		translateCurrent.targetCountry = mapOfCountries["hti"]
	}

	return &translateCurrent
}

// Definition of a translation between a source and a target country
type Translation struct {
	sourceCountry *CountryWithBodies
	targetCountry *CountryWithBodies
}

func (t *Translation) GetSourceCountryName() string {
	return t.sourceCountry.Name
}

func (t *Translation) SetSourceCountry(name string) {
	t.sourceCountry = mapOfCountries[name]
}

func (t *Translation) GetTargetCountryName() string {
	return t.targetCountry.Name
}

func (t *Translation) SetTargetCountry(name string) {
	t.targetCountry = mapOfCountries[name]
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInSourceCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.sourceCountry.ClosestBodyInOriginalPosition(lat, lng)
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInTargetCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.targetCountry.ClosestBodyInOriginalPosition(lat, lng)
}

// from x, y get closest body lat/lng in target country
func (t *Translation) LatLngToXYInTargetCountry(x, y float64) (latTarget, lngTarget float64) {

	return t.targetCountry.XYToLatLng(x, y)
}

// from a coordinate in source coutry, get border
func (t *Translation) TargetBorder(x, y float64) PointList {

	return t.targetCountry.XYtoTerritoryBodies(x, y)
}

func (t *Translation) SourceBorder(lat, lng float64) PointList {

	Info.Printf("Source Border for lat %f lng %f", lat, lng)

	points := t.sourceCountry.LatLngToTerritoryBorder(lat, lng)

	Info.Printf("Source Border nb of points %d", len(points))

	return points
}
