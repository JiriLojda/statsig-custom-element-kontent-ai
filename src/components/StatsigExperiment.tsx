import { useMemo } from 'react';
import { useValue, useItemInfo, useIsDisabled } from '../customElement/CustomElementContext';
import { getExperiment } from '../api/statsig';
import { ExperimentDetails } from './ExperimentDetails';
import { CreateExperiment } from './CreateExperiment';
import { useAsyncConditional } from '../hooks/useAsync';
import styles from './StatsigExperiment.module.css';

type Props = Readonly<{
  onHeightChange: () => void;
}>;

export const StatsigExperiment = ({ onHeightChange }: Props) => {
  const [value, setValue] = useValue();
  const itemInfo = useItemInfo();
  const isDisabled = useIsDisabled();

  const experimentId = value?.experimentId ?? null;

  const asyncFn = useMemo(
    () => experimentId ? async () => {
      const experiment = await getExperiment(experimentId);
      onHeightChange();
      return experiment;
    } : null,
    [experimentId, onHeightChange]
  );

  const { data: experiment, isLoading, error, refetch } = useAsyncConditional(
    asyncFn,
    [experimentId]
  );

  const handleCreated = (newExperimentId: string) => {
    setValue({ experimentId: newExperimentId });
  };

  const handleUnlink = () => {
    setValue(null);
  };

  if (!experimentId) {
    return (
      <CreateExperiment
        itemInfo={itemInfo}
        onCreated={handleCreated}
        onHeightChange={onHeightChange}
        isDisabled={isDisabled}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <svg className={styles.spinner} fill="none" viewBox="0 0 24 24">
          <circle className={styles.spinnerTrack} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className={styles.spinnerHead} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className={styles.loadingText}>Loading experiment...</span>
      </div>
    );
  }

  if (error || !experiment) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className={styles.errorBody}>
            <h3 className={styles.errorTitle}>Experiment not found</h3>
            <p className={styles.errorMessage}>
              The experiment "<code className={styles.errorCode}>{experimentId}</code>" was not found in Statsig.
              It may have been deleted.
            </p>
            <div className={styles.errorActions}>
              <button
                type="button"
                onClick={() => refetch()}
                className={styles.errorLink}
              >
                Retry
              </button>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={handleUnlink}
                  className={styles.errorLink}
                >
                  Unlink experiment
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ExperimentDetails
      experiment={experiment}
      onUnlink={handleUnlink}
      isDisabled={isDisabled}
    />
  );
};
