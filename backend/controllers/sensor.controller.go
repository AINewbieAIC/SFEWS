package controllers

import (
	"sfews-backend/services"

	"github.com/gin-gonic/gin"
)

type SensorController struct {
	Service services.SensorService
}

func NewSensorController(service services.SensorService) *SensorController {
	return &SensorController{Service: service}
}

func (s *SensorController) GetRain(ctx *gin.Context) {

}
