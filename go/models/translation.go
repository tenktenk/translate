package models

import (
	"github.com/tenktenk/translate/go/grump"
)

// some stiff

// Singloton pointing to the current translation
// the singloton can be autocally initiated if it is nil
var TranslationtSingloton Translation

// storage for all countries
var MapOfCountryWithBodies map[string]*CountryWithBodies = nil

// Singloton pattern to init the current translation
func GetOrInitTranslateCurrent(path string) *Translation {

	// check if the current translation is void.
	if MapOfCountryWithBodies == nil {

		MapOfCountryWithBodies = make(map[string]*CountryWithBodies)

		// stage the country
		for _, countrySpec := range countrySpecs {
			countryWithBodies := (&CountryWithBodies{
				Country: grump.Country{
					Name: countrySpec.Name,
				},
				NbBodies: countrySpec.NbBodies,
				Step:     countrySpec.Step,
			}).Stage()

			countryWithBodies.Stage()
			countryWithBodies.Init(path)

			MapOfCountryWithBodies[countryWithBodies.Name] = countryWithBodies
		}

		TranslationtSingloton.SourceCountryWithBodies = MapOfCountryWithBodies["fra"]
		TranslationtSingloton.TargetCountryWithBodies = MapOfCountryWithBodies["hti"]
	}

	return &TranslationtSingloton
}

// Definition of a translation between a source and a target country
type Translation struct {
	Name                    string
	SourceCountryWithBodies *CountryWithBodies
	TargetCountryWithBodies *CountryWithBodies
}

func (t *Translation) GetSourceCountryName() string {
	return t.SourceCountryWithBodies.Name
}

func (t *Translation) SetSourceCountry(name string) {
	t.SourceCountryWithBodies = MapOfCountryWithBodies[name]
}

func (t *Translation) GetTargetCountryName() string {
	return t.TargetCountryWithBodies.Name
}

func (t *Translation) SetTargetCountry(name string) {
	t.TargetCountryWithBodies = MapOfCountryWithBodies[name]
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInSourceCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.SourceCountryWithBodies.ClosestBodyInOriginalPosition(lat, lng)
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInTargetCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.TargetCountryWithBodies.ClosestBodyInOriginalPosition(lat, lng)
}

// from x, y get closest body lat/lng in target country
func (t *Translation) LatLngToXYInTargetCountry(x, y float64) (latTarget, lngTarget float64) {

	return t.TargetCountryWithBodies.XYToLatLng(x, y)
}

// from a coordinate in source coutry, get border
func (t *Translation) TargetBorder(x, y float64) PointList {

	return t.TargetCountryWithBodies.XYtoTerritoryBodies(x, y)
}

func (t *Translation) SourceBorder(lat, lng float64) PointList {

	Info.Printf("Source Border for lat %f lng %f", lat, lng)

	points := t.SourceCountryWithBodies.LatLngToTerritoryBorder(lat, lng)

	Info.Printf("Source Border nb of points %d", len(points))

	return points
}
