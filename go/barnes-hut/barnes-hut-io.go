package barneshut

import (
	"archive/zip"
	"bytes"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/tenktenk/translate/go/quadtree"
	// "github.com/tenktenk/translate/go/models"
)

const (
	CountryBodiesNamePattern = "conf-%s-%08d-%05d.bods"
)
const (
	CountryBodiesGifNamePattern = "conf-%s-%08d-%05d.gif"
)
const (
	CountryBodiesSVGNamePattern = "conf-%s-%08d-%05d.svg"
)

// serialize bodies's state vector into a file
// convention is "step-xxxx.bod"
// return true if operation was successful
// works only if state is STOPPED
func (r *Run) CaptureConfig() bool {
	if r.state == STOPPED {

		filename := fmt.Sprintf(r.OutputDir+"/"+CountryBodiesNamePattern, r.country, len(*r.bodies), r.step)
		file, err := os.Create(filename)
		if err != nil {
			log.Fatal(err)
			return false
		}
		jsonBodies, _ := json.MarshalIndent(r.bodies, "", "\t")
		file.Write(jsonBodies)
		file.Close()

		// r.CaptureConfigBase64()
		return true
	} else {
		return false
	}
}

func (r *Run) CaptureGif() bool {
	filename := fmt.Sprintf(CountryBodiesGifNamePattern, r.country, len(*r.bodies), r.step)
	file, err := os.Create(r.OutputDir + "/" + filename)
	if err != nil {
		log.Fatal(err)
		return false
	}
	r.RenderGif(file, false)
	file.Close()
	return true
}

func (r *Run) CaptureSVG() bool {
	filename := fmt.Sprintf(CountryBodiesSVGNamePattern, r.country, len(*r.bodies), r.step)
	file, err := os.Create(filename)
	if err != nil {
		log.Fatal(err)
		return false
	}
	r.RenderSVG(file)
	file.Close()
	return true
}

func (r *Run) CaptureConfigBase64() bool {
	if r.state == STOPPED {
		filename := fmt.Sprintf("conf-base64-TST-%05d.bods", r.step)
		file, err := os.Create(filename)
		if err != nil {
			log.Fatal(err)
			return false
		}
		buf := new(bytes.Buffer)

		// encoder := base64.NewEncoder(base64.StdEncoding, &b)
		// encoder.Write( *(r.bodies))
		// encoder.Close()

		for _, v := range *r.bodies {
			err = binary.Write(buf, binary.LittleEndian, v.X)
			err = binary.Write(buf, binary.LittleEndian, v.Y)
		}
		file.Write(buf.Bytes())

		file.Close()
		return true
	} else {
		return false
	}
}

// load configuration from filename (does not contain path)
// works only if state is STOPPED
func (r *Run) LoadConfig(path string, filename string, countryTrigram string, step int, nbBodies int) bool {
	Info.Printf("LoadConfig file %s", filename)

	var bodsFileReader io.ReadCloser
	var bodsFileReaderErr error

	if r.state == STOPPED {

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

		bodies := (make([]quadtree.Body, 0))
		if err := jsonParser.Decode(&bodies); err != nil {
			log.Fatal(fmt.Sprintf("parsing config file %s", err.Error()))
		}
		Info.Printf("nb item parsed in file for orig %d\n", len(bodies))

		bodsFileReader.Close()

		// r.bodies = countryToLoad.GetBodies()

		renderingMutex.Lock()

		r.bodies = &bodies
		Info.Printf("nb item parsed in file %d\n", len(*r.bodies))
		r.Init(r.bodies)

		renderingMutex.Unlock()
		return true
	} else {
		return false
	}

}

// load configuration from filename into the original config (for computing borders)
// works only if state is STOPPED
func (r *Run) LoadConfigOrig(filename string) bool {
	if r.state == STOPPED {

		file, err := os.Open(filename)
		if err != nil {
			log.Fatal(err)
			return false
		}

		ctry := filename[5:8]
		if r.country != string(ctry) {
			Error.Printf("original country %s should be the same as current country %s", ctry, r.country)
		}
		stepString := filename[9:14]

		_, errScan := fmt.Sscanf(stepString, "%05d", &r.step)
		if errScan != nil {
			log.Fatal(errScan)
			return false
		}

		jsonParser := json.NewDecoder(file)
		if err = jsonParser.Decode(r.bodiesOrig); err != nil {
			log.Fatal(fmt.Sprintf("parsing config file %s", err.Error()))
		}

		file.Close()
		return true
	} else {
		return false
	}
}

// return the list of available configuration
func (r *Run) DirConfig() []string {

	// open the current working directory
	cwd, error := os.Open(".")

	if error != nil {
		panic("not able to open current working directory")
	}

	// get files with their names
	names, err := cwd.Readdirnames(0)

	if err != nil {
		panic("cannot read names in current working directory")
	}

	// parse the list of names and pick the ones that match the
	var result []string

	for _, dirname := range names {
		if strings.Contains(dirname, CurrentCountry) {
			result = append(result, dirname)
		}
	}

	return result
}
