import test from 'node:test';
import assert from 'node:assert/strict';
import { store, categories, products } from '../lib/store.ts';
import { validateCatalog, filterProducts, formatPrice, buildPurchaseUrl, buildContactUrl } from '../lib/catalog.ts';

const copy = (x) => structuredClone(x);
const valid = { ...store, whatsapp: '628000000001' }; // URL parsing fixture only; never contact.

test('demo data valid; empty catalog and unavailable contact allowed', () => {
  assert.equal(products.length, 8); assert.equal(categories.length, 3);
  assert.equal(store.name, 'WattUp!'); assert.equal(store.whatsapp, '6282325185544'); assert.equal(store.openingHours, '08.00–22.00'); assert.equal(store.isDemo, true);
  assert.equal(new URL(buildContactUrl(store)).pathname, '/6282325185544');
  assert.equal(new URL(buildPurchaseUrl(store, products[0])).pathname, '/6282325185544');
  assert.equal(buildPurchaseUrl({ ...store, whatsapp: '' }, products[0]), null);
  assert.equal(buildContactUrl({ ...store, whatsapp: '' }), null);
  assert.doesNotThrow(() => validateCatalog({ ...store, whatsapp: '' }, categories, []));
  assert.ok(products.some(p => p.availability === 'sold_out'));
  assert.doesNotThrow(() => validateCatalog(store, categories, products));
  assert.doesNotThrow(() => validateCatalog({ ...store, whatsapp: '+invalid' }, categories, []));
});
test('mandatory Store fields rejected', () => {
  for (const field of ['name', 'logo', 'description']) assert.throws(() => validateCatalog({ ...store, [field]: '' }, categories, products), new RegExp(field));
  assert.throws(() => validateCatalog({ ...store, isDemo: 'true' }, categories, products), /isDemo/);
});
test('category and product duplicates rejected', () => {
  assert.throws(() => validateCatalog(store, [...categories, categories[0]], products), /category/);
  assert.throws(() => validateCatalog(store, categories, [...products, products[0]]), /code/);
  for (const field of ['id', 'name']) assert.throws(() => validateCatalog(store, [{ ...categories[0], [field]: '' }], []), /category/);
});
test('invalid product fields fail explicitly', () => {
  const invalid = { code: '', name: '', categoryId: 'missing', price: 0, image: 'https://invalid.test/x', imageAlt: '', description: '', specs: [], availability: 'unknown' };
  for (const [field,value] of Object.entries(invalid)) assert.throws(() => validateCatalog(store, categories, [{ ...products[0], [field]: value }]), new RegExp(field));
  for (const price of [-1, 1.5, Infinity, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => validateCatalog(store, categories, [{ ...products[0], price }]), /price/);
  assert.throws(() => validateCatalog(store, categories, [{ ...products[0], specs: Array(6).fill({label:'a',value:'b'}) }]), /specs/);
  assert.throws(() => validateCatalog(store, categories, [{ ...products[0], specs: [{label:'',value:'x'}, {label:'x',value:'x'}, {label:'x',value:'x'}] }]), /specs/);
  assert.doesNotThrow(() => validateCatalog(store, categories, [{ ...products[0], image: null }]));
});
test('literal filter combines query/category, trims and preserves order', () => {
  assert.deepEqual(filterProducts(products, '', 'all'), products);
  assert.deepEqual(filterProducts(products, `  ${products[0].name.toUpperCase()}  `, 'all'), [products[0]]);
  assert.deepEqual(filterProducts(products, products[0].name, 'audio'), []);
  assert.deepEqual(filterProducts(products, '', 'audio'), products.filter(p => p.categoryId === 'audio'));
  assert.deepEqual(filterProducts(products, '[.*]', 'all'), []);
  assert.deepEqual(filterProducts(products, '', 'missing'), []);
});
test('purchase preview available without receiver and matches outgoing draft', async () => {
  const { purchaseMessage } = await import('../lib/catalog.ts');
  assert.equal(typeof purchaseMessage, 'function');
  assert.equal(purchaseMessage(store, products[0]), new URL(buildPurchaseUrl(valid, products[0])).searchParams.get('text'));
  assert.ok(purchaseMessage(store, products[0]).includes('Halo WattUp!'));
});
test('Rupiah uses integer amount, no decimals', () => {
  assert.match(formatPrice(125000).replaceAll('\u00a0', ' '), /^Rp\s*125\.000$/);
});
test('invalid numbers never produce links; no auto repair', () => {
  for (const whatsapp of ['', '08123456789', '+628123456789', '62 8123456', 'https://wa.me/123', '1234567', '1234567890123456']) {
    assert.equal(buildPurchaseUrl({ ...store, whatsapp }, products[0]), null);
    assert.equal(buildContactUrl({ ...store, whatsapp }), null);
  }
});
test('sold out forbids purchase but general contact remains valid', () => {
  assert.equal(buildPurchaseUrl(valid, { ...products[0], availability:'sold_out' }), null);
  assert.ok(buildContactUrl(valid));
});
test('purchase URL exact receiver, one text parameter, exact decoded draft', () => {
  const product = { ...copy(products[0]), name:'A & B + C # ? 日本\nBaru', availability:'available' };
  const url = new URL(buildPurchaseUrl(valid, product));
  assert.equal(url.origin, 'https://wa.me'); assert.equal(url.pathname, `/${valid.whatsapp}`);
  assert.deepEqual([...url.searchParams.keys()], ['text']); assert.equal(url.hash, '');
  assert.equal(url.searchParams.get('text'), `Halo WattUp!, saya ingin memesan:\nProduk: ${product.name}\nKode: ${product.code}\nJumlah: 1\nHarga katalog: ${formatPrice(product.price)}\nMohon konfirmasi ketersediaan, harga akhir, dan ongkir. Terima kasih.`);
});
test('general contact draft has no product; zero within receiver preserved', () => {
  const url = new URL(buildContactUrl(valid));
  assert.equal(url.pathname, '/628000000001');
  assert.equal(url.searchParams.get('text'), 'Halo WattUp!, saya ingin bertanya tentang produk elektronik yang tersedia.');
});
