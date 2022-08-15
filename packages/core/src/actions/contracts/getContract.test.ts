import { describe, expect, it } from 'vitest';

import { getSigner } from '../../../test/utils';

import { allChainId } from '../../constants';
import { getController } from './getContract';

describe('getContract', () => {
  it('default', () => {
    const result = getController(allChainId.arbitrum, getSigner());
    expect(result).toBeDefined();
  });
});
