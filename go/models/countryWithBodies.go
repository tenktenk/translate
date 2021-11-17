package models

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"path/filepath"

	barneshut "github.com/tenktenk/translate/go/barnes-hut"
	"github.com/tenktenk/translate/go/grump"
	"github.com/tenktenk/translate/go/quadtree"
)

type CountryWithBodies struct {
	grump.Country

	NbBodies int // nb of bodies according to the filename

	bodiesOrig     *[]quadtree.BodyXY // original bodies position in the quatree
	bodiesSpread   *[]quadtree.BodyXY // bodies position in the quatree after the spread simulation
	VilCoordinates [][]int
	Step           int // step when the simulation stopped
}

type Point struct {
	X, Y float64
}

func MakePoint(x float64, y float64) Point {
	return Point{X: x, Y: y}
}

type PointList []Point

type BodySetChoice string

const (
	ORIGINAL_CONFIGURATION = "ORIGINAL_CONFIGURATION"
	SPREAD_CONFIGURATION   = "SPREAD_CONFIGURATION"
)

// number of village per X or Y axis. For 10 000 villages, this number is 100
// this value can be set interactively during the run
var nbVillagePerAxe int = 100
var numberOfVillagePerAxe float64 = 100.0

// init variables
func (countryWithBodies *CountryWithBodies) Init(path string) {

	// unserialize from conf-<country trigram>.coord
	// store step because the unseralize set it to a wrong value
	step := countryWithBodies.Step
	countryWithBodies.Unserialize()
	countryWithBodies.Step = step

	Info.Printf("Init after Unserialize name %s", countryWithBodies.Name)
	Info.Printf("Init after Unserialize step %d", countryWithBodies.Step)

	countryWithBodies.LoadConfig(path, true)  // load config at the end  of the simulation
	countryWithBodies.LoadConfig(path, false) // load config at the start of the simulation

	countryWithBodies.VilCoordinates = make([][]int, countryWithBodies.NbBodies)
	for idx := range countryWithBodies.VilCoordinates {
		countryWithBodies.VilCoordinates[idx] = make([]int, 2)
	}

	countryWithBodies.ComputeBaryCenters()

}

var bodsFileReader io.ReadCloser
var bodsFileReaderErr error

// load configuration from filename into country
// check that it matches the
func (countryWithBodies *CountryWithBodies) LoadConfig(path string, isOriginal bool) bool {

	bodsFileReaderErr = nil

	Info.Printf("Load Config begin : Country is %s, step %d isOriginal %t", countryWithBodies.Name, countryWithBodies.Step, isOriginal)

	// computing the file name from the step
	step := 0

	// if isOrignal load the file with the step number 0, else use spread
	if !isOriginal {
		step = countryWithBodies.Step
	}

	filename := fmt.Sprintf(barneshut.CountryBodiesNamePattern, countryWithBodies.Name, countryWithBodies.NbBodies, step)
	Info.Printf("LoadConfig (orig = true/final = false) %t file %s for country %s at step %d", isOriginal, filename, countryWithBodies.Name, step)

	filename = filepath.Join(path, filename)

	// check if file is missing.
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		Info.Printf("File %s is missing, trying to find the zip file", filename)

		zipFilename := filename + ".zip"
		Info.Printf("Checking if zip file %s is present", zipFilename)
		if _, err := os.Stat(zipFilename); os.IsNotExist(err) {
			log.Fatal(err)
			return false
		}

		Info.Printf("Loading zip file %s", zipFilename)
		reader, err := zip.OpenReader(zipFilename)
		if err != nil {
			log.Fatal(err)
		}
		defer reader.Close()
		Info.Printf("Loading zip file %s done", zipFilename)

		for _, file := range reader.File {

			bodsFileReader, bodsFileReaderErr = file.Open()
			Info.Printf("Open bods file %s in zip", file.Name)
			if bodsFileReaderErr != nil {
				log.Fatal(bodsFileReaderErr)
				return false
			}
			defer bodsFileReader.Close()

		}
	}

	jsonParser := json.NewDecoder(bodsFileReader)

	bodies := (make([]quadtree.BodyXY, 0))
	if isOriginal {
		countryWithBodies.bodiesOrig = &bodies
		if err := jsonParser.Decode(countryWithBodies.bodiesOrig); err != nil {
			log.Fatal(fmt.Sprintf("parsing config file %s", err.Error()))
		}
		Info.Printf("nb item parsed in file for orig %d\n", len(*countryWithBodies.bodiesOrig))
	} else {
		countryWithBodies.bodiesSpread = &bodies
		if err := jsonParser.Decode(countryWithBodies.bodiesSpread); err != nil {
			log.Fatal(fmt.Sprintf("parsing config file %s", err.Error()))
		}
		Info.Printf("nb item parsed in file for spread %d\n", len(*countryWithBodies.bodiesSpread))
	}

	bodsFileReader.Close()

	Info.Printf("Load Config end : Country is %s, step %d", countryWithBodies.Name, countryWithBodies.Step)

	return true
}

// compute villages barycenters
func (countryWithBodies *CountryWithBodies) ComputeBaryCenters() {
	Info.Printf("ComputeBaryCenters begins for country %s", countryWithBodies.Name)

	// parse bodiesSpread to compute bary centers
	// use bodiesOrig to compute bary centers
	for index, b := range *countryWithBodies.bodiesSpread {

		// compute village coordinate (from 0 to nbVillagePerAxe-1)
		villageX := int(math.Floor(float64(nbVillagePerAxe) * b.X))
		villageY := int(math.Floor(float64(nbVillagePerAxe) * b.Y))

		Trace.Printf("Adding body index %d to village %d %d", index, villageX, villageY)

		countryWithBodies.VilCoordinates[index][0] = villageX
		countryWithBodies.VilCoordinates[index][1] = villageY
	}
}

// given lat, lng, get coords after simulation
func (countryWithBodies *CountryWithBodies) ClosestBodyInOriginalPosition(lat, lng float64) (
	distance,
	latClosest, lngClosest,
	xSpread, ySpread float64,
	closestIndex int) {

	// compute relative coordinates within the square
	xRel, yRel := countryWithBodies.LatLng2XY(lat, lng)

	// parse all bodies and get closest body
	closestIndex = -1
	minDistance := 1000000000.0 // we start from away
	for index, b := range *countryWithBodies.bodiesOrig {
		distanceX := b.X - xRel
		distanceY := b.Y - yRel
		distance := math.Sqrt((distanceX * distanceX) + (distanceY * distanceY))

		if distance < minDistance {
			closestIndex = index
			minDistance = distance
		}
	}

	xRelClosest := (*countryWithBodies.bodiesOrig)[closestIndex].X
	yRelClosest := (*countryWithBodies.bodiesOrig)[closestIndex].Y

	latOptimClosest, lngOptimClosest := countryWithBodies.XY2LatLng(xRelClosest, yRelClosest)

	Info.Printf("Country %s", countryWithBodies.Name)
	Info.Printf("ClosestBodyInOriginalPosition %f %f relative to country %f %f", lat, lng, xRel, yRel)
	Info.Printf("ClosestBodyInOriginalPosition rel closest %f %f lat lng closest %f %f", xRelClosest, yRelClosest, latOptimClosest, lngOptimClosest)

	// compute x, y in spread bodies
	xSpread = (*countryWithBodies.bodiesSpread)[closestIndex].X
	ySpread = (*countryWithBodies.bodiesSpread)[closestIndex].Y

	Info.Printf("ClosestBodyInOriginalPosition village %f %f index %d", xSpread, ySpread, closestIndex)

	return minDistance, latOptimClosest, lngOptimClosest, xSpread, ySpread, closestIndex
}

func (countryWithBodies *CountryWithBodies) XYToLatLng(x, y float64) (lat, lng float64) {

	Info.Printf("XYSpreadToLatLngOrig input x %f y %f", x, y)

	// parse all bodies and get closest body
	closestIndex := -1
	minDistance := 1000000000.0 // we start from away
	for index, b := range *countryWithBodies.bodiesSpread {
		distanceX := b.X - x
		distanceY := b.Y - y
		distance := math.Sqrt((distanceX * distanceX) + (distanceY * distanceY))

		if distance < minDistance {
			closestIndex = index
			minDistance = distance
		}
	}

	xRelClosest := (*countryWithBodies.bodiesOrig)[closestIndex].X
	yRelClosest := (*countryWithBodies.bodiesOrig)[closestIndex].Y
	latOptimClosest, lngOptimClosest := countryWithBodies.XY2LatLng(xRelClosest, yRelClosest)
	Info.Printf("XYSpreadToLatLngOrig target x %f y %f index %d distance %f", xRelClosest, yRelClosest, closestIndex, minDistance)

	Info.Printf("XYSpreadToLatLngOrig target lat %f lng %f", latOptimClosest, lngOptimClosest)

	return latOptimClosest, lngOptimClosest
}

// get the bodies of a village from x, y spread coordinates
func (countryWithBodies *CountryWithBodies) XYtoTerritoryBodies(x, y float64) PointList {

	Info.Printf("XYtoTerritoryBodies %s", countryWithBodies.Name)
	points := make(PointList, 0)

	// compute village min & max coord
	xMinVillage := float64(int(x*numberOfVillagePerAxe)) / numberOfVillagePerAxe
	xMaxVillage := float64(int(x*numberOfVillagePerAxe+1.0)) / numberOfVillagePerAxe
	yMinVillage := float64(int(y*numberOfVillagePerAxe)) / numberOfVillagePerAxe
	yMaxVillage := float64(int(y*numberOfVillagePerAxe+1.0)) / numberOfVillagePerAxe

	// parse all bodies and get closest body
	for index, b := range *countryWithBodies.bodiesSpread {
		if (xMinVillage <= b.X) && (b.X < xMaxVillage) && (yMinVillage <= b.Y) && (b.Y < yMaxVillage) {

			xRelClosest := (*countryWithBodies.bodiesOrig)[index].X
			yRelClosest := (*countryWithBodies.bodiesOrig)[index].Y
			latOptimClosest, lngOptimClosest := countryWithBodies.XY2LatLng(xRelClosest, yRelClosest)

			points = append(points, MakePoint(latOptimClosest, lngOptimClosest))
		}
	}

	return points
}

// given x, y of a point, return the border in the country
func (countryWithBodies *CountryWithBodies) LatLngToTerritoryBorder(lat, lng float64) PointList {

	// from input lat, lng, get the xSpread, ySpread
	_, _, _, xSpread, ySpread, _ := countryWithBodies.ClosestBodyInOriginalPosition(lat, lng)

	return countryWithBodies.XYtoTerritoryBodies(xSpread, ySpread)

}
