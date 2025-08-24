package helpers

import "testing"

func TestTime(t *testing.T) {
	dateFormat := UnixToDate(1756040212)
	t.Log(dateFormat)
}
