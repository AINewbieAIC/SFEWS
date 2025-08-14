package routes

import (
	"github.com/gin-gonic/gin"
)

func (r *Routes) SensorRoutes(group *gin.RouterGroup) {
	group.GET("/rain", r.SensorController.GetRain)
}
