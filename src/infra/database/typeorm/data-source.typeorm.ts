import { DataSource, DataSourceOptions } from 'typeorm';
import ORM_CONFIG from './typeorm.config';

const dataSourceConfig = ORM_CONFIG as DataSourceOptions;
export default new DataSource(dataSourceConfig);
