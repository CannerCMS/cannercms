import { AppConfig } from 'simple-oidc-server/lib/config';
import { Logger } from '../common/interface';

export interface AuthConfig extends AppConfig {
  mountPath?: string;
  logger?: Logger;
}
