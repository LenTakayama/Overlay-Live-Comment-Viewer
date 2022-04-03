import { join } from 'path';

export function getResourceDirectory(): string {
  return process.env.NODE_ENV === 'development'
    ? join(process.cwd(), 'build')
    : join(__dirname);
}

export function getExtraDirectory(): string {
  return process.env.NODE_ENV === 'development'
    ? join(process.cwd(), 'public')
    : join(process.resourcesPath, 'public');
}
