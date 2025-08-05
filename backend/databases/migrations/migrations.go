package migrations

import (
	"sfews-backend/databases"
	"sfews-backend/models"
)

func Migrations() error {
	err := databases.DB.AutoMigrate(&models.Hujan{})
	return err
}
