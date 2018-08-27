package models

import (
	"time"
)

type NetWorth struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"userId" db:"user_id"`
	Year      int       `json:"year" db:"year"`
	Month     int       `json:"month" db:"month"`
	CreatedAt time.Time `json:"-" db:"created_at"`
	UpdatedAt time.Time `json:"-" db:"updated_at"`
}

type NetWorths []NetWorth
