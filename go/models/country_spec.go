package models

type CountrySpec struct {
	Name           string
	NbBodies, Step int
}

// CountrySpecs is the list of countries that are loaded at startup
var CountrySpecs = []*CountrySpec{
	France,
	Haiti,
	Usa,
	// China,
	// Russia,
}

var France = (&CountrySpec{Name: "fra", NbBodies: 934136, Step: 8725}).Stage()
var Haiti = (&CountrySpec{Name: "hti", NbBodies: 190948, Step: 1334}).Stage()
var Usa = (&CountrySpec{Name: "usa", NbBodies: 1422837, Step: 2735}).Stage()
var Chine = (&CountrySpec{Name: "chn", NbBodies: 771973, Step: 2531}).Stage()
var Russia = (&CountrySpec{Name: "rus", NbBodies: 509497, Step: 3386}).Stage()
