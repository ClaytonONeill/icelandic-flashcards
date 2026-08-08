import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ThemePicker } from '@/components/theme-picker'
import { ThemeProvider } from './theme-provider'

describe('ThemeProvider + ThemePicker', () => {
  it('applies the selected theme to the document root', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemePicker />
      </ThemeProvider>,
    )

    await user.selectOptions(screen.getByRole('combobox'), 'forest')

    expect(document.documentElement).toHaveAttribute('data-theme', 'forest')
  })
})
