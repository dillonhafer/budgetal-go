package models

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"log"
	"time"

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
	AvatarFileName      nulls.String   `json:"avatarFileName" db:"avatar_file_name"`
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
