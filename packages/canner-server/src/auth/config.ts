import { AppConfig } from 'simple-oidc-server/lib/config';

export interface AuthConfig extends AppConfig {
  mountPath?: string;
}
