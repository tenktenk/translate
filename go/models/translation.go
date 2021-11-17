package models

import (
	"github.com/tenktenk/translate/go/grump"
)

// Singloton pointing to the current translation
// the singloton can be autocally initiated if it is nil
var translateCurrent Translation

// storage for all countries
var mapOfCountryWithBodies map[string]*CountryWithBodies = nil

type CountrySpec struct {
	Name           string
	NbBodies, Step int
}

// should have done this array directly with CountryWithBodies but
// aint compile even with
// 	CountryWithBodies{Name: "fra", NbBodies: 934136, Step: 8725},
var countrySpecs = []*CountrySpec{
	(&CountrySpec{Name: "fra", NbBodies: 934136, Step: 8725}).Stage(),
	(&CountrySpec{Name: "hti", NbBodies: 190948, Step: 1334}).Stage(),
	// (&CountrySpec{Name: "usa", NbBodies: 1422837, Step: 2735}).Stage(),
	// CountrySpec{Name: "chn", NbBodies: 771973, Step: 2531},
	// CountrySpec{Name: "rus", NbBodies: 509497, Step: 3386},
}

// Singloton pattern to init the current translation
func GetOrInitTranslateCurrent(path string) *Translation {

	// check if the current translation is void.
	if mapOfCountryWithBodies == nil {

		mapOfCountryWithBodies = make(map[string]*CountryWithBodies)

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

			mapOfCountryWithBodies[countryWithBodies.Name] = countryWithBodies
		}

		translateCurrent.sourceCountryWithBodies = mapOfCountryWithBodies["fra"]
		translateCurrent.targetCountryWithBodies = mapOfCountryWithBodies["hti"]
	}

	return &translateCurrent
}

// Definition of a translation between a source and a target country
type Translation struct {
	sourceCountryWithBodies *CountryWithBodies
	targetCountryWithBodies *CountryWithBodies
}

func (t *Translation) GetSourceCountryName() string {
	return t.sourceCountryWithBodies.Name
}

func (t *Translation) SetSourceCountry(name string) {
	t.sourceCountryWithBodies = mapOfCountryWithBodies[name]
}

func (t *Translation) GetTargetCountryName() string {
	return t.targetCountryWithBodies.Name
}

func (t *Translation) SetTargetCountry(name string) {
	t.targetCountryWithBodies = mapOfCountryWithBodies[name]
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInSourceCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.sourceCountryWithBodies.ClosestBodyInOriginalPosition(lat, lng)
}

// from lat, lng in source country, find the closest body in source country
func (t *Translation) BodyCoordsInTargetCountry(lat, lng float64) (distance, latClosest, lngClosest, xSpread, ySpread float64, closestIndex int) {

	// convert from lat lng to x, y in the Country
	return t.targetCountryWithBodies.ClosestBodyInOriginalPosition(lat, lng)
}

// from x, y get closest body lat/lng in target country
func (t *Translation) LatLngToXYInTargetCountry(x, y float64) (latTarget, lngTarget float64) {

	return t.targetCountryWithBodies.XYToLatLng(x, y)
}

// from a coordinate in source coutry, get border
func (t *Translation) TargetBorder(x, y float64) PointList {

	return t.targetCountryWithBodies.XYtoTerritoryBodies(x, y)
}

func (t *Translation) SourceBorder(lat, lng float64) PointList {

	Info.Printf("Source Border for lat %f lng %f", lat, lng)

	points := t.sourceCountryWithBodies.LatLngToTerritoryBorder(lat, lng)

	Info.Printf("Source Border nb of points %d", len(points))

	return points
}
