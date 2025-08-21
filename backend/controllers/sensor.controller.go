package controllers

import (
	"net/http"
	"sfews-backend/helpers"
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
	rain, err := s.Service.GetLastRain()
	if err != nil {
		helpers.ResponseJson(ctx, http.StatusInternalServerError, false, nil, err.Error())
		return
	}

	helpers.ResponseJson(ctx, http.StatusOK, true, rain, "Success get rain")
}
