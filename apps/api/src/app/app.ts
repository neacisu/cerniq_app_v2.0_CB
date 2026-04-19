import * as path from 'node:path';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import AutoLoad from '@fastify/autoload';

/** Opțiuni plugin pentru `app()`; aliniat la contractul Fastify `register()`. */
export type AppOptions = FastifyPluginOptions;

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    ignorePattern: /\.(spec|test)\.[tj]s$/,
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    ignorePattern: /\.(spec|test)\.[tj]s$/,
    options: { ...opts },
  });
}
