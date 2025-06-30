import { TypeOrmModuleOptions } from '@nestjs/typeorm';

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public getBuildInformation() {
    return this.getValue('VERSION', true);
  }

  public getJwtSecret() {
    return this.getValue('JWT_SECRET', true);
  }

  public getJwtRefreshSecret() {
    return this.getValue('JWT_REFRESH_SECRET', true);
  }

  public getOTLPEndpoint() {
    return this.getValue('OTEL_EXPORTER_OTLP_ENDPOINT', true);
  }

  public getNodeEnv() {
    return this.getValue('NODE_ENV', true);
  }

  public getServiceName() {
    return this.getValue('SERVICE_NAME', true);
  }

  public getAppVersion() {
    return this.getValue('VERSION', false);
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('DB_HOST'),
      port: parseInt(this.getValue('DB_PORT')),
      username: this.getValue('DB_USERNAME'),
      password: this.getValue('DB_PASSWORD'),
      database: this.getValue('DB_NAME'),
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: this.getValue('MIGRATION_AUTO') == 'true',
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  'PORT',
  'MIGRATION_AUTO',
  'VERSION',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'OTEL_EXPORTER_OTLP_ENDPOINT',
  'NODE_ENV',
  'SERVICE_NAME',
]);

export { configService };
