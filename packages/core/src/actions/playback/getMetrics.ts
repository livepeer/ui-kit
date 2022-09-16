import { GetMetricsArgs, LivepeerProvider, Metrics } from '../../types';
import { getLivepeerProvider } from '../providers';

export function getMetrics<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetMetricsArgs): Promise<Metrics> {
  const provider = getLivepeerProvider<TLivepeerProvider>();
  return provider.getMetrics(args);
}
