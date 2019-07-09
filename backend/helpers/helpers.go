package helpers

import (
	"crypto/rand"
	"encoding/hex"
	"time"
)

func AllowedYear(year int) bool {
	currentYear := time.Now().Local().Year()
	return year > 2014 && year < currentYear+4
}

func AllowedNetWorthYear(year int) bool {
	return year > 1900 && year < 2100
}

func AllowedMonth(month int) bool {
	return month > 0 && month < 13
}

func RandomBytes(n int) []byte {
	b := make([]byte, n)
	_, err := rand.Read(b)
	if err != nil {
		panic(err)
	}
	return b
}

func RandomHex(s int) string {
	b := RandomBytes(s)
	hexstring := hex.EncodeToString(b)
	return hexstring
}
