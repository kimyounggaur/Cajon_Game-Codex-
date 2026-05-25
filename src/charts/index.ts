import { beginnerChart } from './beginner.chart';
import { fillChallengeChart } from './fillChallenge.chart';
import { groove8Chart } from './groove8.chart';
import { tutorialChart } from './tutorial.chart';

export const CHARTS = [tutorialChart, beginnerChart, groove8Chart, fillChallengeChart] as const;

export type ChartId = (typeof CHARTS)[number]['id'];

export function getChartById(id: string) {
  return CHARTS.find((chart) => chart.id === id) ?? tutorialChart;
}
