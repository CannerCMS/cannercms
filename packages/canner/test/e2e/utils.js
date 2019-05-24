export function testIdSelector(testid, tag) {
  return `${tag || ''}[data-testid="${testid}"]`;
}
