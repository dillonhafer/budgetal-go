package models

import (
	"encoding/json"
	"time"

	"github.com/fatih/color"
	"github.com/markbates/pop"
	"github.com/markbates/pop/nulls"
	"github.com/satori/go.uuid"
)

type Session struct {
	AuthenticationKey   uuid.UUID  `json:"authenticationKey" db:"authentication_key"`
	AuthenticationToken string     `json:"authenticationToken" db:"authentication_token"`
	IpAddress           string     `json:"ipAddress" db:"ip"`
	UserID              int        `json:"userId" db:"user_id"`
	UserAgent           string     `json:"userAgent" db:"user_agent"`
	ExpiredAt           nulls.Time `json:"expiredAt" db:"expired_at"`
	CreatedAt           time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt           time.Time  `json:"updatedAt" db:"updated_at"`
}

func (s *Session) Create(tx *pop.Connection) string {
	query := "insert into sessions (authentication_token, user_agent, user_id, ip) VALUES (:authentication_token, :user_agent, :user_id, :ip)"
	tx.Store.NamedExec(query, s)
	tx.Where("authentication_token = ? and user_id = ?", s.AuthenticationToken, s.UserID).First(s)
	return color.YellowString(query)
}

func (s *Session) Delete(tx *pop.Connection) string {
	query := "update sessions set expired_at = now() where authentication_key = :authentication_key"
	tx.Store.NamedExec(query, s)
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
