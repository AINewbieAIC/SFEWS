package routes

import (
	"github.com/gin-gonic/gin"
)

func (r *Routes) SensorRoutes(group *gin.RouterGroup) {
	rain := group.Group("/rain")
	{
		rain.GET("/", r.SensorController.GetRain)
		rain.GET("/all/:limit", r.SensorController.GetAllRain)
	}
}
