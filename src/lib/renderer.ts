/**
 * WebGPU renderer factory for R3F (Task T-12).
 *
 * On the "high" tier we render with three's WebGPURenderer instead of WebGL.
 * It's loaded via dynamic import so the (large) three/webgpu module only ships
 * to devices that will actually use it. Standard materials render correctly
 * under WebGPURenderer, so no material rewrite is needed for the baseline.
 *
 * If WebGPU init throws, we fall back to a regular WebGL renderer so the scene
 * still shows (upholds the "never a blank screen" rule).
 */

// R3F passes default renderer props (including { canvas }). Typed loosely to
// avoid depending on three/webgpu's types at build time.
type GlProps = Record<string, unknown> & { canvas: HTMLCanvasElement };

export async function createWebGPURenderer(props: GlProps): Promise<unknown> {
  try {
    const webgpu = (await import('three/webgpu')) as {
      WebGPURenderer: new (p: unknown) => { init(): Promise<void> };
    };
    const renderer = new webgpu.WebGPURenderer(props);
    await renderer.init();
    return renderer;
  } catch (err) {
    console.warn('[renderer] WebGPU init failed, falling back to WebGL:', err);
    const three = await import('three');
    return new three.WebGLRenderer({
      canvas: props.canvas,
      antialias: true,
      powerPreference: 'high-performance',
    });
  }
}
