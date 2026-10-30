import { render, screen } from '@testing-library/react'
import { WikiMarkdown } from '../WikiMarkdown'

const alpineClubUrl = 'https://publications.americanalpineclub.org/articles/13201216361'

test('turns a plain https URL into a link that opens in a new tab', () => {
  render(<WikiMarkdown>{`Report: ${alpineClubUrl}`}</WikiMarkdown>)
  const link = screen.getByRole('link', { name: alpineClubUrl })
  expect(link).toHaveAttribute('href', alpineClubUrl)
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noopener noreferrer')
})

test('turns a www URL into a link and keeps OpenBeta on this tab', () => {
  render(<WikiMarkdown>See www.openbeta.io/about for more.</WikiMarkdown>)
  const link = screen.getByRole('link', { name: 'www.openbeta.io/about' })
  expect(link).toHaveAttribute('href', 'http://www.openbeta.io/about')
  expect(link).not.toHaveAttribute('target')
})

test('keeps an existing markdown link and leaves a bare domain as text', () => {
  render(
    <WikiMarkdown>
      A [guide](https://example.com) and cascadeclimbers.com/forum stay as written.
    </WikiMarkdown>
  )
  const guide = screen.getByRole('link', { name: 'guide' })
  expect(guide).toHaveAttribute('href', 'https://example.com')
  expect(guide).toHaveAttribute('target', '_blank')
  expect(screen.queryByRole('link', { name: /cascadeclimbers/ })).not.toBeInTheDocument()
  expect(screen.getByText(/cascadeclimbers.com\/forum/)).toBeInTheDocument()
})

test('does not link a URL written in inline code', () => {
  render(<WikiMarkdown>Use `https://example.com` as a placeholder.</WikiMarkdown>)
  expect(screen.queryByRole('link')).not.toBeInTheDocument()
})

test('does not keep a javascript URL on a markdown link', () => {
  render(<WikiMarkdown>[click](javascript:alert(1))</WikiMarkdown>)
  const link = screen.queryByRole('link')
  expect(link?.getAttribute('href') ?? '').not.toMatch(/^javascript:/)
})
