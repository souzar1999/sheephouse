package main

import (
	"archive/zip"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"net/http"

	"github.com/AdRoll/goamz/aws"
	"github.com/AdRoll/goamz/s3"
	redigo "github.com/garyburd/redigo/redis"
)

type Configuration struct {
	AccessKey          string
	SecretKey          string
	Bucket             string
	Region             string
	RedisServer        string
	Port               int
}

var config = Configuration{}
var aws_bucket *s3.Bucket
var redisPool *redigo.Pool

type RedisFile struct {
	FileName string
	Folder   string
	S3Path   string
	FileId       int64 `json:",string"`
	ProjectId    int64 `json:",string"`
	ProjectName  string
	Modified     string
	ModifiedTime time.Time
}

func main() {
	configFile, _ := os.Open("conf.json")
	decoder := json.NewDecoder(configFile)
	err := decoder.Decode(&config)
	if err != nil {
		panic("Erro lendo Configuração")
	}

	initAwsBucket()
	InitRedis()

	fmt.Println("Running on port", config.Port)
	http.HandleFunc("/", handler)
	http.ListenAndServe(":"+strconv.Itoa(config.Port), nil)
}

func parseFileDates(files []*RedisFile) {
	layout := "2006-01-02T15:04:05Z"
	for _, file := range files {
		t, err := time.Parse(layout, file.Modified)
		if err != nil {
			fmt.Println(err)
			continue
		}
		file.ModifiedTime = t
	}
}

func initAwsBucket() {
	expiration := time.Now().Add(time.Hour * 1)
	auth, err := aws.GetAuth(config.AccessKey, config.SecretKey, "", expiration)
	if err != nil {
		panic(err)
	}

	aws_bucket = s3.New(auth, aws.GetRegion(config.Region)).Bucket(config.Bucket)
}

func InitRedis() {
	redisPool = &redigo.Pool{
		MaxIdle:     10,
		IdleTimeout: 1 * time.Second,
		Dial: func() (redigo.Conn, error) {
			return redigo.Dial("tcp", config.RedisServer)
		},
		TestOnBorrow: func(c redigo.Conn, t time.Time) (err error) {
			if time.Since(t) < time.Minute {
				return nil
			}
			_, err = c.Do("PING")
			if err != nil {
				panic("Erro conectando redis")
			}
			return
		},
	}
}

var makeSafeFileName = regexp.MustCompile(`[#<>:"/\|?*\\]`)

func getFilesFromRedis(ref string) (files []*RedisFile, err error) {

	redis := redisPool.Get()
	defer redis.Close()

	result, err := redis.Do("GET", "zip:"+ref)
	if err != nil || result == nil {
		err = errors.New("O link que você esta tentando acessar não é mais valido")
		return
	}

	var resultByte []byte
	var ok bool
	if resultByte, ok = result.([]byte); !ok {
		err = errors.New("Erro convertendo arquivo")
		return
	}

	err = json.Unmarshal(resultByte, &files)
	if err != nil {
		err = errors.New("Erro ao decodificar o json: " + string(resultByte))
	}

	parseFileDates(files)

	return
}

func handler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	health, ok := r.URL.Query()["health"]
	if len(health) > 0 {
		fmt.Fprintf(w, "OK")
		return
	}

	refs, ok := r.URL.Query()["ref"]
	if !ok || len(refs) < 1 {
		http.Error(w, "Pagina Invalida", 500)
		return
	}
	ref := refs[0]

	downloadas, ok := r.URL.Query()["downloadas"]
	if !ok && len(downloadas) > 0 {
		downloadas[0] = makeSafeFileName.ReplaceAllString(downloadas[0], "")
		if downloadas[0] == "" {
			downloadas[0] = "download.zip"
		}
	} else {
		downloadas = append(downloadas, "download.zip")
	}

	files, err := getFilesFromRedis(ref)
	if err != nil {
		http.Error(w, err.Error(), 403)
		log.Printf("%s\t%s\t%s", r.Method, r.RequestURI, err.Error())
		return
	}

	w.Header().Add("Content-Disposition", "attachment; filename=\""+downloadas[0]+"\"")
	w.Header().Add("Content-Type", "application/zip")

	zipWriter := zip.NewWriter(w)
	for _, file := range files {

		if file.S3Path == "" {
			log.Printf("Missing path for file: %v", file)
			continue
		}

		safeFileName := makeSafeFileName.ReplaceAllString(file.FileName, "")
		if safeFileName == "" {
			safeFileName = "file"
		}

		rdr, err := aws_bucket.GetReader(file.S3Path)
		if err != nil {
			switch t := err.(type) {
			case *s3.Error:
				if t.StatusCode == 404 {
					log.Printf("File not found. %s", file.S3Path)
				}
			default:
				log.Printf("Error downloading \"%s\" - %s", file.S3Path, err.Error())
			}
			continue
		}

		zipPath := ""
		if file.ProjectId > 0 {
			zipPath += strconv.FormatInt(file.ProjectId, 10) + "."
			file.ProjectName = makeSafeFileName.ReplaceAllString(file.ProjectName, "")
			if file.ProjectName == "" {
				file.ProjectName = "Project"
			}
			zipPath += file.ProjectName + "/"
		}

		if file.Folder != "" {
			zipPath += file.Folder
			if !strings.HasSuffix(zipPath, "/") {
				zipPath += "/"
			}
		}
		zipPath += safeFileName
		
		h := &zip.FileHeader{
			Name:   zipPath,
			Method: zip.Deflate,
			Flags:  0x800,
		}

		if file.Modified != "" {
			h.SetModTime(file.ModifiedTime)
		}

		f, _ := zipWriter.CreateHeader(h)

		io.Copy(f, rdr)
		rdr.Close()
	}

	zipWriter.Close()

	log.Printf("%s\t%s\t%s", r.Method, r.RequestURI, time.Since(start))
}
