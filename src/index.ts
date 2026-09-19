export const name = 'dsh-plugin-sirchmunk';

interface HostPluginContext {
  logger?: {
    info(message: string): void;
  };
}

export function apply(ctx: HostPluginContext): void {
  ctx.logger?.info('[dsh-plugin-sirchmunk] Host plugin applied');
}
