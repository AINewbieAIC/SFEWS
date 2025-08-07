package migrations

import (
	"sfews-backend/models"

	"gorm.io/gorm"
)

func Migrations(db *gorm.DB) error {
	// err := databases.DB.AutoMigrate(&models.Hujan{})
	err := db.AutoMigrate(&models.Rain{})
	return err
}
