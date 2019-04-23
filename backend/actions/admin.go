package actions

import (
	"fmt"
	"time"

	"github.com/dillonhafer/budgetal-go/backend/mailers"
	"github.com/dillonhafer/budgetal-go/backend/models"
	humanize "github.com/dustin/go-humanize"
	"github.com/gobuffalo/buffalo"
	"github.com/gobuffalo/nulls"
)

func fmtDuration(d time.Duration) string {
	d = d.Round(time.Minute)
	h := d / time.Hour
	d -= h * time.Hour
	m := d / time.Minute
	return fmt.Sprintf("%02d:%02d", h, m)
}

type User struct {
	ID             int          `json:"-" db:"id"`
	Email          string       `json:"email" db:"email"`
	FirstName      nulls.String `json:"firstName" db:"first_name"`
	LastName       nulls.String `json:"lastName" db:"last_name"`
	LastSignIn     string       `json:"lastSignIn" db:"last_sign_in"`
	IP             string       `json:"ip" db:"last_ip"`
	Total          int          `json:"signInCount" db:"sign_in_count"`
	AvatarFileName nulls.String `json:"-" db:"avatar_file_name"`
	AvatarUrl      string       `json:"avatarUrl" db:"-"`
}

func AdminUsers(c buffalo.Context, currentUser *models.User) error {
	users := []User{}
	err := map[string]*[]User{"users": &[]User{}}

	if currentUser.Admin != true {
		return c.Render(401, r.JSON(err))
	}

	allErr := getUsers(&users)
	if allErr != nil {
		return c.Render(422, r.JSON(allErr))
	}
	for i := range users {
		user := &users[i]
		url := &models.User{ID: user.ID, AvatarFileName: user.AvatarFileName}
		user.AvatarUrl = url.AvatarUrl()
	}

	return c.Render(200, r.JSON(map[string]*[]User{"users": &users}))
}

func AdminServerInfo(c buffalo.Context, currentUser *models.User) error {
	if currentUser.Admin != true {
		return c.Render(401, r.JSON(""))
	}

	uptime := humanize.Time(StartTime)
	return c.Render(200, r.JSON(map[string]string{"uptime": uptime}))
}

func AdminTestEmail(c buffalo.Context, currentUser *models.User) error {
	if currentUser.Admin != true {
		return c.Render(401, r.JSON(""))
	}

	err := mailers.SendTestEmail(currentUser)
	if err == nil {
		c.Logger().Debug(err)
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}
func AdminTestPushNotification(c buffalo.Context, currentUser *models.User) error {
	if currentUser.Admin != true {
		return c.Render(401, r.JSON(""))
	}

	var params = struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	}{
		"",
		"",
	}

	if err := BindParams(c, &params); err != nil {
		return err
	}

	err := currentUser.SendPushNotification(params.Title, params.Body)

	if err != nil {
		return c.Render(422, r.JSON(map[string]string{"error": "Could not send Push Notification"}))
	}

	return c.Render(200, r.JSON(map[string]bool{"ok": true}))
}

func AdminErrorPage(c buffalo.Context, currentUser *models.User) error {
	if currentUser.Admin != true {
		return c.Render(401, r.JSON(""))
	}

	var i int
	i = c.Value("foo").(int)

	return c.Render(200, r.JSON(map[string]int{"count": 1 + i}))
}

func getUsers(users *[]User) error {
	query := `
		with max_created_at as (
		  select user_id, max(created_at) as max
		  from sessions
		  group by user_id
		), latest_sessions as (
		  select sessions.user_id, ip, created_at
		  from sessions
		  join max_created_at on sessions.created_at = max_created_at.max
		)
		select
			id,
			email,
			first_name,
			last_name,
			latest_sessions.ip as last_ip,
			latest_sessions.created_at as last_sign_in,
			count(sessions.*) as sign_in_count,
			avatar_file_name
		from users
		join sessions on users.id = sessions.user_id
		join latest_sessions on users.id = latest_sessions.user_id
		group by 1,2,3,4,5,6,8
		order by 6 desc
	`
	return models.DB.RawQuery(query).All(users)
}
