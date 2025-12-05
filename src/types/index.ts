// Statsig experiment types
export type StatsigExperimentStatus = 'setup' | 'active' | 'decision_made' | 'abandoned';

export type StatsigExperimentGroup = {
  readonly name: string;
  readonly size: number;
  readonly parameterValues: Record<string, unknown>;
};

export type StatsigExperiment = {
  readonly id: string;
  readonly name: string;
  readonly status: StatsigExperimentStatus;
  readonly hypothesis?: string;
  readonly description?: string;
  readonly groups?: ReadonlyArray<StatsigExperimentGroup>;
  readonly createdTime?: number;
  readonly startTime?: number;
  readonly endTime?: number;
};

export type CreateExperimentParams = {
  readonly name: string;
  readonly hypothesis?: string;
  readonly description?: string;
};
