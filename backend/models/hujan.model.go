package models

import (
	"time"
)

type Hujan struct {
	ID               uint    `gorm:"primaryKey"`
	Timestamp        int     `json:"timestamp"`
	WaterLevel       float64 `json:"water_level"`
	RainStatus       string  `json:"rain_status"`
	RainAdcIntensity float64 `json:"rain_adc_intensity"`
	CreatedAt        time.Time
	DeletedAt        time.Time
}
