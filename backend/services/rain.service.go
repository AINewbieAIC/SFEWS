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
	return s.Repo.Insert(data)
}

func (s *SensorService) GetLastRain() (*models.Rain, error) {
	rain, err := s.Repo.GetLast()
	if err != nil {
		return nil, err
	}

	return rain, nil
}

func (s *SensorService) GetAllRain(limit int) ([]models.Rain, error) {
	rains, err := s.Repo.GetAll(limit)
	if err != nil {
		return nil, err
	}

	return rains, nil
}
