package services

import "sfews-backend/repositories"

type SensorService struct {
	Repo repositories.SensorRepo
}

func NewSensorService(repo repositories.SensorRepo) *SensorService {
	return &SensorService{Repo: repo}
}
