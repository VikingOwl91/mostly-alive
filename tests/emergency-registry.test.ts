import { describe, it, expect } from 'vitest';
import { EMERGENCY_REGISTRY } from '../src/lib/types/emergency';

describe('Emergency Registry', () => {
	it('should contain verified emergency numbers for all core regions', () => {
		expect(EMERGENCY_REGISTRY.de).toBeDefined();
		expect(EMERGENCY_REGISTRY.de.generalEmergency).toBe('112');
		expect(EMERGENCY_REGISTRY.de.police).toBe('110');

		expect(EMERGENCY_REGISTRY.us).toBeDefined();
		expect(EMERGENCY_REGISTRY.us.generalEmergency).toBe('911');

		expect(EMERGENCY_REGISTRY.uk).toBeDefined();
		expect(EMERGENCY_REGISTRY.uk.generalEmergency).toBe('999');

		expect(EMERGENCY_REGISTRY.au).toBeDefined();
		expect(EMERGENCY_REGISTRY.au.generalEmergency).toBe('000');

		expect(EMERGENCY_REGISTRY.eu).toBeDefined();
		expect(EMERGENCY_REGISTRY.eu.generalEmergency).toBe('112');
	});
});
