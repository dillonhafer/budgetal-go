package models

import (
	"database/sql/driver"
	"encoding/json"
	"time"

	"github.com/fatih/color"
	"github.com/markbates/pop"
	"github.com/satori/go.uuid"
)

type NullTime struct {
	Time  time.Time
	Valid bool // Valid is true if Time is not NULL
}

// Scan implements the Scanner interface.
func (nt *NullTime) Scan(value interface{}) error {
	nt.Time, nt.Valid = value.(time.Time)
	return nil
}

// Value implements the driver Valuer interface.
func (nt NullTime) Value() (driver.Value, error) {
	if !nt.Valid {
		return nil, nil
	}
	return nt.Time, nil
}

type Session struct {
	AuthenticationKey   uuid.UUID `json:"authenticationKey" db:"authentication_key"`
	AuthenticationToken string    `json:"authenticationToken" db:"authentication_token"`
	IpAddress           string    `json:"ipAddress" db:"ip"`
	UserID              int       `json:"userId" db:"user_id"`
	UserAgent           string    `json:"userAgent" db:"user_agent"`
	ExpiredAt           NullTime  `json:"expiredAt" db:"expired_at"`
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
	UpdatedAt           time.Time `json:"updated_at" db:"updated_at"`
}

func (s *Session) Create(tx *pop.Connection) string {
	query := "insert into sessions (authentication_token, user_agent, user_id, ip) VALUES (:authentication_token, :user_agent, :user_id, :ip)"
	tx.TX.NamedExec(query, s)
	tx.Where("authentication_token = ? and user_id = ?", s.AuthenticationToken, s.UserID).First(s)
	return color.YellowString(query)
}

func (s *Session) Delete(tx *pop.Connection) string {
	query := "update sessions set expired_at = now() where authentication_key = :authentication_key"
	tx.TX.NamedExec(query, s)
	return color.YellowString(query)
}

func (s *Session) ID() uuid.UUID {
	return s.AuthenticationKey
}

func (s *Session) PrimaryKeyType() string {
	return "UUID"
}

// Sessions is not required by pop and may be deleted
type Sessions []Session

// String is not required by pop and may be deleted
func (s Session) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}
