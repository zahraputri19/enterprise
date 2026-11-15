export function getProductVisual(name = '') {
  const lower = name.toLowerCase()
  if (lower.includes('monitor')) return { icon: '🖥️', tag: 'Display' }
  if (lower.includes('laptop') || lower.includes('stand')) return { icon: '💻', tag: 'Aksesoris Laptop' }
  if (
    lower.includes('headset')
    || lower.includes('headphone')
    || lower.includes('earphone')
    || lower.includes('earbud')
    || lower.includes('audio')
  ) {
    return { icon: '🎧', tag: 'Audio' }
  }
  if (lower.includes('mouse')) return { icon: '🖱️', tag: 'Peripheral' }
  if (lower.includes('keyboard')) return { icon: '⌨️', tag: 'Peripheral' }
  return { icon: '📦', tag: 'Produk' }
}
