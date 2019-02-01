import { AppConfig } from 'simple-oidc-server/lib/config';
import { Logger } from '@canner/server-common/lib/interface';

export interface AuthConfig extends AppConfig {
  mountPath?: string;
  logger?: Logger;
}
