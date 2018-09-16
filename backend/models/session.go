package models

import (
	"encoding/json"
	"time"

	"github.com/fatih/color"
	"github.com/gobuffalo/pop/nulls"
	"github.com/gobuffalo/uuid"
)

type Session struct {
	AuthenticationKey     uuid.UUID    `json:"authenticationKey" db:"authentication_key"`
	AuthenticationToken   string       `json:"authenticationToken" db:"authentication_token"`
	IpAddress             string       `json:"ipAddress" db:"ip"`
	UserID                int          `json:"userId" db:"user_id"`
	UserAgent             string       `json:"userAgent" db:"user_agent"`
	DeviceName            nulls.String `json:"deviceName" db:"device_name"`
	PushNotificationToken nulls.String `json:"-" db:"push_notification_token"`
	ExpiredAt             nulls.Time   `json:"expiredAt" db:"expired_at"`
	CreatedAt             time.Time    `json:"createdAt" db:"created_at"`
	UpdatedAt             time.Time    `json:"updatedAt" db:"updated_at"`
}

func (s *Session) Create() string {
	query := `
		insert into sessions (
			authentication_token,
			user_agent,
			user_id,
			ip,
			device_name
		) values (
			:authentication_token,
			:user_agent,
			:user_id,
			:ip,
			:device_name
		)
	`
	DB.Store.NamedExec(query, s)
	DB.Where("authentication_token = ? and user_id = ?", s.AuthenticationToken, s.UserID).First(s)
	return color.YellowString(query)
}

func (s *Session) Delete() string {
	query := "update sessions set expired_at = now() where authentication_key = :authentication_key"
	DB.Store.NamedExec(query, s)
	return color.YellowString(query)
}

func (s *Session) ID() uuid.UUID {
	return s.AuthenticationKey
}

func (s *Session) PrimaryKeyType() string {
	return "UUID"
}

// UpdatePushNotificationToken updates the PN token if it is valid
func (s *Session) UpdatePushNotificationToken(token nulls.String) {
	if !token.Valid {
		return
	}

	s.PushNotificationToken = token

	query := "update sessions set push_notification_token = :push_notification_token where authentication_key = :authentication_key"
	DB.Store.NamedExec(query, s)
	color.YellowString(query)
}

// Sessions is not required by pop and may be deleted
type Sessions []Session

// String is not required by pop and may be deleted
func (s Session) String() string {
	js, _ := json.Marshal(s)
	return string(js)
}
