package controllers

import (
	"net/http"
	"sfews-backend/helpers"
	"sfews-backend/services"
	"strconv"

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

func (s *SensorController) GetAllRain(ctx *gin.Context) {
	limit := ctx.Param("limit")

	limitInt, err := strconv.Atoi(limit)
	if err != nil {
		helpers.ResponseJson(ctx, http.StatusBadRequest, false, nil, "failed read limit")
		return
	}

	rains, err := s.Service.GetAllRain(limitInt)
	if err != nil {
		helpers.ResponseJson(ctx, http.StatusInternalServerError, false, nil, err.Error())
		return
	}

	helpers.ResponseJson(ctx, http.StatusOK, true, rains, "Success get rains")
}
