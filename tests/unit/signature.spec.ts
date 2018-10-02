import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import parse_sigs from '@/signature';

describe('Signature Parser Test', () => {
  it('Parse test', () => {
    const data = `BEA-659	Cosmic Anomaly	Combat Site	Blood Haven	100,0%	10,47 AU`;
    const sigs = parse_sigs(data);
    const sig = sigs[0];
    expect(sig.id).to.equal('BEA-659');
    expect(sig.name).to.equal('Blood Haven');
  });
  it('Filter test', () => {
    const data = `ABP-820	Cosmic Anomaly	Combat Site	Blood Raider Forsaken Rally Point	100,0%	13,27 AU
    AYZ-256	Cosmic Anomaly	Ore Site	Enormous Potent Asteroid Cluster	100,0%	8,28 AU
    BEA-659	Cosmic Anomaly	Combat Site	Blood Haven	100,0%	10,47 AU`;
    const sigs = parse_sigs(data);
    expect(sigs.length).to.equal(2);
  });
});
