import { StatsigExperiment } from './components/StatsigExperiment';
import { CustomElementContext } from './customElement/CustomElementContext';
import styles from './IntegrationApp.module.css';

export const IntegrationApp = () => {
  return (
    <div className={styles.container}>
      <CustomElementContext height={400}>
        <StatsigExperiment />
      </CustomElementContext>
    </div>
  );
};

IntegrationApp.displayName = 'IntegrationApp';
