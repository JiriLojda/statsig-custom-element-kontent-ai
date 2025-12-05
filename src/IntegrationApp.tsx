import { useState } from 'react';
import { StatsigExperiment } from './components/StatsigExperiment';
import { CustomElementContext } from './customElement/CustomElementContext';
import styles from './IntegrationApp.module.css';

export const IntegrationApp = () => {
  const [heightKey, setHeightKey] = useState(0);
  return (
    <div className={styles.container}>
      <CustomElementContext height="dynamic" heightKey={heightKey.toString()}>
        <StatsigExperiment onHeightChange={() => setHeightKey(prev => prev + 1)} />
      </CustomElementContext>
    </div>
  );
};

IntegrationApp.displayName = 'IntegrationApp';
