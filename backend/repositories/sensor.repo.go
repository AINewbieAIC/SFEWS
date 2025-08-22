package repositories

import (
	"sfews-backend/models"

	"gorm.io/gorm"
)

type SensorRepo struct {
	DB *gorm.DB
}

func NewSensorRepo(db *gorm.DB) *SensorRepo {
	return &SensorRepo{DB: db}
}

func (s *SensorRepo) GetAll(limit int) ([]models.Rain, error) {
	var rains []models.Rain
	if err := s.DB.Limit(limit).Find(&rains).Error; err != nil {
		return nil, err
	}

	return rains, nil
}

func (s *SensorRepo) GetLast() (*models.Rain, error) {
	var rain models.Rain
	if err := s.DB.Last(&rain).Error; err != nil {
		return nil, err
	}

	return &rain, nil
}

func (s *SensorRepo) Insert(data *models.Rain) error {
	return s.DB.Create(&data).Error
}
