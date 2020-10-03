package models

import (
	"bytes"
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"log"
	"mime/multipart"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/disintegration/imaging"
	"github.com/gobuffalo/envy"
	"github.com/gobuffalo/nulls"
	"github.com/gobuffalo/pop"
	"github.com/gobuffalo/validate"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID                  int          `json:"-" db:"id"`
	Email               string       `json:"email" db:"email"`
	FirstName           nulls.String `json:"firstName" db:"first_name"`
	LastName            nulls.String `json:"lastName" db:"last_name"`
	Admin               bool         `json:"admin" db:"admin"`
	PasswordResetToken  nulls.String `json:"-" db:"password_reset_token"`
	PasswordResetSentAt nulls.Time   `json:"-" db:"password_reset_sent_at"`
	AvatarFileName      nulls.String `json:"-" db:"avatar_file_name"`
	AvatarContentType   nulls.String `json:"-" db:"avatar_content_type"`
	AvatarFileSize      nulls.Int64  `json:"-" db:"avatar_file_size"`
	AvatarUpdatedAt     nulls.Time   `json:"-" db:"avatar_updated_at"`
	EncryptedPassword   string       `json:"-" db:"encrypted_password"`
	CreatedAt           time.Time    `json:"-" db:"created_at"`
	UpdatedAt           time.Time    `json:"-" db:"updated_at"`
	CurrentSession      *Session     `json:"-" db:"-"`
}

// String is not required by pop and may be deleted
func (u User) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// NullableFirstName returns JSON nulls if empty
func (u *User) NullableFirstName() *string {
	var firstName *string
	if u.FirstName.Valid {
		firstName = &u.FirstName.String
	}

	return firstName
}

// NullableLastName returns JSON nulls if empty
func (u *User) NullableLastName() *string {
	var lastName *string
	if u.LastName.Valid {
		lastName = &u.LastName.String
	}

	return lastName
}

func (u *User) MarshalJSON() ([]byte, error) {
	type Alias User
	return json.Marshal(&struct {
		*Alias
		AvatarUrl string `json:"avatarUrl" db:"-"`
	}{
		Alias:     (*Alias)(u),
		AvatarUrl: u.AvatarUrl(),
	})
}

func (u *User) localAvatarUrl() string {
	var ENV = envy.Get("GO_ENV", "development")
	var root = envy.Get("APP_DOMAIN", "")

	if ENV == "development" {
		root = resolveHostIp()
		if root != "" {
			port := envy.Get("FRONTEND_PORT", "3000")
			root = fmt.Sprintf("http://%s:%s", root, port)
		}
	}

	return fmt.Sprintf("%s/users/avatars/%d/%s", root, u.ID, u.AvatarFileName.String)
}

func (u *User) localMissingUrl() string {
	var ENV = envy.Get("GO_ENV", "development")
	var root = envy.Get("APP_DOMAIN", "")

	if ENV == "development" {
		root = resolveHostIp()
		if root != "" {
			port := envy.Get("FRONTEND_PORT", "3000")
			root = fmt.Sprintf("http://%s:%s", root, port)
		}
	}

	if ENV == "development" {
		return fmt.Sprintf("%s/users/avatars/missing-profile.png", root)
	}

	return fmt.Sprintf("%s/missing-profile.png", root)
}

func (u *User) s3MissingUrl() string {
	bucket := envy.Get("AWS_S3_BUCKET", "")
	return fmt.Sprintf("https://s3.amazonaws.com/%s/images/missing-profile.png", bucket)
}

func (u *User) s3AvatarUrl() string {
	bucket := envy.Get("AWS_S3_BUCKET", "")
	return fmt.Sprintf("https://s3.amazonaws.com/%s/users/avatars/%d/%s", bucket, u.ID, u.AvatarFileName.String)
}

func (u *User) AvatarUrl() string {
	usingS3 := envy.Get("AWS_S3_BUCKET", "") != ""

	if u.AvatarFileName.Valid {
		if usingS3 {
			return u.s3AvatarUrl()
		} else {
			return u.localAvatarUrl()
		}
	}

	if usingS3 {
		return u.s3MissingUrl()
	} else {
		return u.localMissingUrl()
	}
}

// Users is not required by pop and may be deleted
type Users []User

// String is not required by pop and may be deleted
func (u Users) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
}

// Validate gets run every time you call a "pop.Validate*" (pop.ValidateAndSave, pop.ValidateAndCreate, pop.ValidateAndUpdate) method.
// This method is not required and may be deleted.
func (u *User) Validate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

func (u *User) VerifyPassword(password string) bool {
	return comparePassword(password, u.EncryptedPassword)
}

func comparePassword(password string, hashedPassword string) bool {
	if hashedPassword == "" {
		return false
	}

	var passwordBuffer bytes.Buffer
	passwordBuffer.WriteString(password)

	val := bcrypt.CompareHashAndPassword([]byte(hashedPassword), passwordBuffer.Bytes())

	return (val == nil)
}

func (u *User) EncryptPassword(password []byte) {
	u.EncryptedPassword = hashAndSalt(password)
}

func hashAndSalt(pwd []byte) string {
	hash, err := bcrypt.GenerateFromPassword(pwd, bcrypt.MinCost)
	if err != nil {
		log.Println(err)
	}
	return string(hash)
}

// ValidateCreate gets run every time you call "pop.ValidateAndCreate" method.
// This method is not required and may be deleted.
func (u *User) ValidateCreate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

// ValidateUpdate gets run every time you call "pop.ValidateAndUpdate" method.
// This method is not required and may be deleted.
func (u *User) ValidateUpdate(tx *pop.Connection) (*validate.Errors, error) {
	return validate.NewErrors(), nil
}

func NewUser(email, password string) User {
	return User{
		Email:             email,
		EncryptedPassword: hashAndSalt([]byte(password)),
	}
}

func (u *User) SaveAvatar(file multipart.File) error {
	// Get File Name
	extension, err := fileContentType(file)
	if err != nil {
		return err
	}
	md5, err := md5FileName(file)
	if err != nil {
		return err
	}
	filename := fmt.Sprintf("%x.%s", md5, extension)

	// Decode & Resize File
	resizedImage, err := createThumbnail(file, extension)
	if err != nil {
		return err
	}

	// Save in-memory file
	if envy.Get("AWS_S3_BUCKET", "") != "" {
		err = saveToS3(u.ID, filename, resizedImage)
	} else {
		err = saveToDisk(u.ID, filename, resizedImage)
	}

	if err != nil {
		return err
	}

	u.AvatarFileName = nulls.String{String: filename, Valid: true}
	u.AvatarContentType = nulls.String{String: extension, Valid: true}
	return nil
}

func createThumbnail(file multipart.File, extension string) (*bytes.Buffer, error) {
	width := 300
	height := 300

	imageData, _, err := image.Decode(file)
	if err != nil {
		return nil, err
	}
	file.Close()

	thumbnail := imaging.Fill(imageData, width, height, imaging.Center, imaging.Lanczos)
	imageBuffer := new(bytes.Buffer)

	switch extension {
	case "png":
		png.Encode(imageBuffer, thumbnail)
	case "jpg":
		jpeg.Encode(imageBuffer, thumbnail, nil)
	}

	return imageBuffer, nil
}

func saveToS3(userId int, filename string, file *bytes.Buffer) error {
	id := strconv.Itoa(userId)
	path := filepath.Join("users", "avatars", id, filename)

	err := S3Upload(path, file)
	if err != nil {
		return err
	}
	return nil
}

func saveToDisk(userId int, filename string, file *bytes.Buffer) error {
	id := strconv.Itoa(userId)
	avatarBase := envy.Get("AVATAR_BASE", filepath.Join("..", "frontend", "public"))
	fullPath := filepath.Join(avatarBase, "users", "avatars", id)
	err := os.MkdirAll(fullPath, os.ModePerm)
	if err != nil {
		return err
	}
	imagePath := filepath.Join(fullPath, filename)
	f, err := os.OpenFile(imagePath, os.O_WRONLY|os.O_CREATE, 0666)
	defer f.Close()
	if err != nil {
		return err
	}

	io.Copy(f, file)
	return nil
}

func md5FileName(file multipart.File) ([]byte, error) {
	hash := md5.New()
	var result []byte
	_, err := io.Copy(hash, file)
	defer file.Seek(0, 0)
	if err != nil {
		return result, err
	}
	return hash.Sum(result), nil
}

func fileContentType(file multipart.File) (string, error) {
	// Only the first 512 bytes are used to sniff the content type.
	extBuffer := make([]byte, 512)
	_, err := file.Read(extBuffer)
	defer file.Seek(0, 0)
	if err != nil {
		return "", nil
	}
	contentType := http.DetectContentType(extBuffer)

	var extension string
	switch contentType {
	case "image/png":
		extension = "png"
	case "image/jpg":
	case "image/jpeg":
		extension = "jpg"
	default:
		return "", errors.New("Wrong file type")
	}
	return extension, nil
}

func resolveHostIp() string {
	netInterfaceAddresses, err := net.InterfaceAddrs()
	if err != nil {
		return ""
	}
	for _, netInterfaceAddress := range netInterfaceAddresses {
		networkIp, ok := netInterfaceAddress.(*net.IPNet)
		if ok && !networkIp.IP.IsLoopback() && networkIp.IP.To4() != nil {
			ip := networkIp.IP.String()
			return ip
		}
	}
	return ""
}

type PushNotification struct {
	To    string `json:"to"`
	Title string `json:"title"`
	Body  string `json:"body"`
	Sound string `json:"sound"`
}

func (u *User) SendPushNotification(title, body string) error {
	url := "https://exp.host/--/api/v2/push/send"

	activeSessions := Sessions{}
	DB.Where("expired_at is null and push_notification_token is not null and user_id = ?", u.ID).All(&activeSessions)

	var pushNotifications []PushNotification
	for _, session := range activeSessions {
		to := session.PushNotificationToken

		if to.Valid {
			pn := PushNotification{
				To:    to.String,
				Title: title,
				Body:  body,
				Sound: `default`,
			}
			pushNotifications = append(pushNotifications, pn)
		}
	}

	notificationCount := len(pushNotifications)
	if notificationCount == 0 {
		return nil
	}

	word := "notifications"
	if notificationCount == 1 {
		word = "notification"
	}
	println(fmt.Sprintf("Sending %d %s", notificationCount, word))

	jsonValue, _ := json.Marshal(pushNotifications)
	var netTransport = &http.Transport{
		Dial: (&net.Dialer{
			Timeout: 5 * time.Second,
		}).Dial,
		TLSHandshakeTimeout: 5 * time.Second,
	}
	var budgetalClient = &http.Client{
		Timeout:   time.Second * 5,
		Transport: netTransport,
	}
	_, err := budgetalClient.Post(url, "application/json", bytes.NewBuffer(jsonValue))
	if err != nil {
		println(fmt.Sprintf("%v", err))
	}

	return err
}

func FindUserForPasswordReset(token string) (*User, error) {
	user := &User{}
	query := `
    password_reset_token = ? and
    password_reset_sent_at between
    (now() - interval '2 hours') and now()
  `
	err := DB.Where(query, token).First(user)
	if err != nil {
		return nil, err
	}

	return user, nil
}
