package controllers

import "sfews-backend/services"

type SensorController struct {
	Service services.SensorService
}

func NewSensorController(service services.SensorService) *SensorController {
	return &SensorController{Service: service}
}
