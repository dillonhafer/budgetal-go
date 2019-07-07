package types

import (
	"mime/multipart"

	"github.com/graphql-go/graphql"
)

type File struct {
	File     multipart.File
	Filename string
	Size     int64
}

var UploadType = graphql.NewScalar(graphql.ScalarConfig{
	Name:        "Upload",
	Description: "HTML Multipart file upload",
})
