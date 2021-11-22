package quadtree

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"os"
)

type BodyXY struct {
	X float64
	Y float64
}

// a body is a position & a mass
type Body struct {
	BodyXY
	M float64

	// coordinate in the quadtree
	coord Coord

	prev, next *Body
}

// bodies of a node are linked together
// Some quadtree use an alternative choice : store bodies of a node in a slice attached
// to the node. This alternative implies memory allocation which one tries to avoid.
// number of memory allocation are benchmaked with
//	go test -bench=BenchmarkUpdateNodesList_10M -benchmem
func (b *Body) Next() *Body { return b.next }

func (b *Body) Coord() Coord { return b.coord }

// get Node coordinates at level 8
func (b Body) getCoord8() Coord {
	var c Coord

	c.SetLevel(8)
	c.setXHexaLevel8(int(b.X * 256.0))
	c.setYHexaLevel8(int(b.Y * 256.0))

	if c.checkIntegrity() == false {
		s := fmt.Sprintf("getCoord8 invalid coord %s", c.String())
		panic(s)
	}
	return c
}

// init a quadtree with random position
func InitBodiesUniform(bodies *[]Body, nbBodies int) {

	// var q Quadtree
	*bodies = make([]Body, nbBodies)

	// init bodies
	for idx := range *bodies {
		(*bodies)[idx].X = rand.Float64()
		(*bodies)[idx].Y = rand.Float64()
		(*bodies)[idx].M = rand.Float64()
	}
}

type BodyArray []BodyXY
type BodyArrayPtr struct {
	*BodyArray
}

func (BodyArrayPtr *BodyArrayPtr) GetArray() *[]BodyXY {
	return (*[]BodyXY)(BodyArrayPtr.BodyArray)
}

// Unmarshall look for file
// if file is absent, look for file with a zip extension
func (bodyArrayPtr *BodyArrayPtr) Unmarshall(path string) (err error) {

	var bodsFileReader io.ReadCloser
	var bodsFileReaderErr error

	// check if file is missing.
	if _, err := os.Stat(path); os.IsNotExist(err) {
		Info.Printf("File %s is missing, trying to find the zip file", path)

		zipFilename := path + ".zip"
		Info.Printf("Checking if zip file %s is present", zipFilename)
		if _, err := os.Stat(zipFilename); os.IsNotExist(err) {
			log.Fatal(err)
			return err
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
				return bodsFileReaderErr
			}
			defer bodsFileReader.Close()
		}
	}

	jsonParser := json.NewDecoder(bodsFileReader)

	// (*bodyArray.BodyArray) =
	targetArray := make([]BodyXY, 0)
	bodyArrayPtr.BodyArray = (*BodyArray)(&targetArray)
	if err := jsonParser.Decode(bodyArrayPtr.BodyArray); err != nil {
		log.Fatal(fmt.Sprintf("parsing config file %s", err.Error()))
		return err
	}
	Info.Printf("nb item parsed in file for orig %d\n", len(targetArray))

	return
}
