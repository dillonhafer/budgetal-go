package models

import (
	"bytes"
	"crypto/md5"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gobuffalo/envy"
	"github.com/markbates/pop"
	"github.com/markbates/pop/nulls"
	"github.com/markbates/validate"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID                  int            `json:"-" db:"id"`
	Email               string         `json:"email" db:"email"`
	FirstName           string         `json:"firstName" db:"first_name"`
	LastName            string         `json:"lastName" db:"last_name"`
	Admin               bool           `json:"admin" db:"admin"`
	PasswordResetToken  nulls.String   `json:"-" db:"password_reset_token"`
	PasswordResetSentAt nulls.Time     `json:"-" db:"password_reset_sent_at"`
	AvatarFileName      nulls.String   `json:"-" db:"avatar_file_name"`
	AvatarContentType   sql.NullString `json:"-" db:"avatar_content_type"`
	AvatarFileSize      sql.NullInt64  `json:"-" db:"avatar_file_size"`
	AvatarUpdatedAt     time.Time      `json:"-" db:"avatar_updated_at"`
	EncryptedPassword   string         `json:"-" db:"encrypted_password"`
	CreatedAt           time.Time      `json:"-" db:"created_at"`
	UpdatedAt           time.Time      `json:"-" db:"updated_at"`
	CurrentSession      *Session       `json:"-" db:"-"`
}

// String is not required by pop and may be deleted
func (u User) String() string {
	ju, _ := json.Marshal(u)
	return string(ju)
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
	return fmt.Sprintf("/users/avatars/%d/%s", u.ID, u.AvatarFileName.String)
}

func (u *User) AvatarUrl() string {
	if u.AvatarFileName.Valid {
		return u.localAvatarUrl()
	}

	return "/missing-profile.png"
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
	err := u.saveLocalAvatar(file)
	if err != nil {
		return err
	}
	return nil
}

func (u *User) saveLocalAvatar(file multipart.File) error {
	extension, err := fileContentType(file)
	if err != nil {
		return err
	}
	md5, err := md5FileName(file)
	if err != nil {
		return err
	}

	filename := fmt.Sprintf("%x.%s", md5, extension)
	err = saveToDisk(u.ID, filename, file)
	if err != nil {
		return err
	}

	u.AvatarFileName = nulls.String{String: filename, Valid: true}
	u.AvatarContentType = sql.NullString{String: extension, Valid: true}
	return nil
}

func saveToDisk(userId int, filename string, file multipart.File) error {
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
