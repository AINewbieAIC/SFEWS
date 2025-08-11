package services

import (
	"sfews-backend/models"
	"sfews-backend/repositories"
)

type SensorService struct {
	Repo repositories.SensorRepo
}

func NewSensorService(repo repositories.SensorRepo) *SensorService {
	return &SensorService{Repo: repo}
}

func (s *SensorService) InsertDataRain(data *models.Rain) error {
	if err := s.Repo.DB.Create(&data).Error; err != nil {
		return err
	}

	return nil
}
