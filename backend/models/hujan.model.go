package models

import (
	"time"
)

type Hujan struct {
	ID               uint `gorm:"primaryKey"`
	Timestamp        int
	WaterLevel       float64
	RainStatus       string
	RainAdcIntensity float64
	CreatedAt        time.Time
	DeletedAt        time.Time
}
