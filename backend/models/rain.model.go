package models

import (
	"time"
)

type Rain struct {
	ID                  uint    `gorm:"primaryKey" json:"-"`
	Timestamp           int     `json:"timestamp"`
	WaterLevel          float64 `json:"water_level"`
	RainStatus          int     `json:"rain_status"`
	RainDurationMinutes int     `json:"rain_duration_minutes"`
	AlertLevel          int     `json:"alert_level"`
	CreatedAt           time.Time
	UpdatedAt           time.Time
}
