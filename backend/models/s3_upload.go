package models

import (
	"bytes"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gobuffalo/envy"
)

func S3Upload(path string, file multipart.File, size int64) error {
	aws_access_key_id := envy.Get("AWS_S3_ACCESS_KEY_ID", "")
	aws_secret_access_key := envy.Get("AWS_S3_SECRET_ACCESS_KEY", "")
	token := envy.Get("AWS_S3_TOKEN", "")
	region := envy.Get("AWS_S3_REGION", "us-east-1")
	bucket := envy.Get("AWS_S3_BUCKET", "")

	creds := credentials.NewStaticCredentials(aws_access_key_id, aws_secret_access_key, token)
	_, err := creds.Get()
	if err != nil {
		return err
	}
	cfg := aws.NewConfig().WithRegion(region).WithCredentials(creds)

	// Get file size
	buffer := make([]byte, size) // read file content to buffer

	file.Read(buffer)
	fileBytes := bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)

	params := &s3.PutObjectInput{
		Bucket:        aws.String(bucket),
		Key:           aws.String(path),
		Body:          fileBytes,
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
		ACL:           aws.String("public-read"),
	}

	svc := s3.New(session.New(), cfg)
	_, err = svc.PutObject(params)
	if err != nil {
		return err
	}

	return nil
}
