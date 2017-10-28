package actions

import (
	"github.com/dillonhafer/budgetal/models"
	"github.com/gobuffalo/buffalo"
	"github.com/markbates/pop"
)

type User struct {
	Email      string `json:"email" db:"email"`
	FirstName  string `json:"firstName" db:"first_name"`
	LastName   string `json:"lastName" db:"last_name"`
	LastSignIn string `json:"lastSignIn" db:"last_sign_in"`
	IP         string `json:"ip" db:"last_ip"`
	Total      int    `json:"signInCount" db:"sign_in_count"`
}

func AdminUsers(c buffalo.Context, currentUser *models.User) error {
	users := &[]User{}
	err := map[string]*[]User{"users": &[]User{}}

	if currentUser.Admin != true {
		return c.Render(200, r.JSON(err))
	}

	tx := c.Value("tx").(*pop.Connection)
	allErr := getUsers(users, tx)
	if allErr != nil {
		return c.Render(200, r.JSON(err))
	}

	return c.Render(200, r.JSON(map[string]*[]User{"users": users}))
}

func getUsers(users *[]User, tx *pop.Connection) error {
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
			email,
			first_name,
			last_name,
			latest_sessions.ip as last_ip,
			latest_sessions.created_at as last_sign_in,
			count(sessions.*) as sign_in_count
		from users
		join sessions on users.id = sessions.user_id
		join latest_sessions on users.id = latest_sessions.user_id
		group by 1,2,3,4,5
		order by 5 desc
	`
	return tx.RawQuery(query).All(users)
}
