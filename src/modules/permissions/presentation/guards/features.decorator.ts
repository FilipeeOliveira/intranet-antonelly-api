import { SetMetadata } from '@nestjs/common';

export const Features = (...features: string[]) =>
    SetMetadata('features', features);