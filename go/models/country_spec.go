package models

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
