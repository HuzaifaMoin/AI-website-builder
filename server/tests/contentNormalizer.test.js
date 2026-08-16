import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeContent } from '../services/contentNormalizer.js';

test('normalizeContent unescapes apostrophes and preserves valid JSX strings', () => {
  const input = `const testimonials = [
  {
    quote: 'Alex\\'s expertise in React and UI design transformed our startup\\'s user interface. The feedback has been incredible.',
    rating: 5,
    name: 'James Chen',
    role: 'CTO, NovaLabs',
  },
];`;

  const output = normalizeContent(input);

  assert.ok(!output.includes("\\'s"), 'apostrophes should be unescaped for valid JS');
  assert.match(output, /quote:\s*'Alex's expertise in React and UI design transformed our startup's user interface\./);
});

test('normalizeContent unescapes escaped double quotes in JSX attributes', () => {
  const input = 'const el = <div className=\\"relative text-white\\" />;';
  const output = normalizeContent(input);

  assert.match(output, /className="relative text-white"/);
});

test('normalizeContent converts literal escaped newlines between JSX attributes into real newlines', () => {
  const input = 'const Header = () => ( <a onClick={() => setIsOpen(false)}\\n              className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors duration-150">Link</a> );';
  const output = normalizeContent(input);

  assert.match(output, /onClick=\{\(\) => setIsOpen\(false\)\}\s*\n\s*className="text-sm font-medium text-zinc-600 hover:text-indigo-600 transition-colors duration-150"/);
});
