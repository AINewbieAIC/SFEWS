import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

interface LineChartProps {
  data: number[];
  labels: string[];
  title: string;
  color: string;
}

export function LineChart({ data, labels, title, color }: LineChartProps) {
  const chartWidth = Math.max(screenWidth - 60, data.length * 40);
  const chartHeight = 200;
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const valueRange = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * (chartWidth - 40) + 20;
    const y =
      chartHeight - 40 - ((value - minValue) / valueRange) * (chartHeight - 60);
    return { x, y, value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={[
            styles.chartContainer,
            { width: chartWidth, height: chartHeight },
          ]}
        >
          <View style={styles.svgContainer}>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = chartHeight - 40 - ratio * (chartHeight - 60);
              return (
                <View
                  key={index}
                  style={[
                    styles.gridLine,
                    {
                      top: y,
                      width: chartWidth - 40,
                      left: 20,
                    },
                  ]}
                />
              );
            })}

            {points.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  {
                    left: point.x - 4,
                    top: point.y - 4,
                    backgroundColor: color,
                  },
                ]}
              />
            ))}

            {points.slice(0, -1).map((point, index) => {
              const nextPoint = points[index + 1];
              const lineWidth = Math.sqrt(
                Math.pow(nextPoint.x - point.x, 2) +
                  Math.pow(nextPoint.y - point.y, 2)
              );
              const angle =
                (Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) *
                  180) /
                Math.PI;

              return (
                <View
                  key={index}
                  style={[
                    styles.line,
                    {
                      left: point.x,
                      top: point.y,
                      width: lineWidth,
                      backgroundColor: color,
                      transform: [{ rotate: `${angle}deg` }],
                    },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.yAxisLabels}>
            {[
              maxValue,
              maxValue * 0.75,
              maxValue * 0.5,
              maxValue * 0.25,
              minValue,
            ].map((value, index) => (
              <Text key={index} style={styles.yLabel}>
                {Math.round(value)}
              </Text>
            ))}
          </View>

          <View style={styles.xAxisLabels}>
            {labels.map((label, index) => (
              <Text
                key={index}
                style={[
                  styles.xLabel,
                  {
                    left:
                      (index / (labels.length - 1)) * (chartWidth - 40) + 10,
                  },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  chartContainer: {
    position: 'relative',
  },
  svgContainer: {
    position: 'relative',
    flex: 1,
  },
  gridLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  line: {
    position: 'absolute',
    height: 2,
    transformOrigin: '0 50%',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  yLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    width: 15,
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 20,
  },
  xLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    width: 20,
  },
});
