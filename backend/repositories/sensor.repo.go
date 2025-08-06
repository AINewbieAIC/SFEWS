package repositories

import "gorm.io/gorm"

type SensorRepo struct {
	DB *gorm.DB
}

func NewSensorRepo(db *gorm.DB) *SensorRepo {
	return &SensorRepo{DB: db}
}
