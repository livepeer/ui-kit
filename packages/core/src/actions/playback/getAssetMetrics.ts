import { GetAssetMetricsArgs, LivepeerProvider, Metrics } from '../../types';
import { getLivepeerProvider } from '../providers';

export function getAssetMetrics<
  TLivepeerProvider extends LivepeerProvider = LivepeerProvider,
>(args: GetAssetMetricsArgs): Promise<Metrics> {
  const provider = getLivepeerProvider<TLivepeerProvider>();
  return provider.getAssetMetrics(args);
}
