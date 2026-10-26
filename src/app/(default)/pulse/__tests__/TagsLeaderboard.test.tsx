import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TagsLeaderboard } from '../TagsLeaderboard'
import { TagsLeaderboardType, TagsByUserType } from '@/js/types'

describe('TagsLeaderboard', () => {
  const createMockUsers = (count: number): TagsByUserType[] => {
    return Array.from({ length: count }, (_, i) => ({
      userUuid: `user-${i + 1}`,
      username: `climber_${i + 1}`,
      total: 100 - i
    }))
  }

  it('renders up to the default limit (20) and shows "Show all" button when users exceed limit', () => {
    const mockData: TagsLeaderboardType = {
      allTime: {
        totalMediaWithTags: 500,
        byUsers: createMockUsers(30)
      }
    }

    render(<TagsLeaderboard tagsLeaderboard={mockData} />)

    expect(screen.getByText('climber_1')).toBeInTheDocument()
    expect(screen.getByText('climber_20')).toBeInTheDocument()
    expect(screen.queryByText('climber_21')).not.toBeInTheDocument()

    const toggleButton = screen.getByRole('button', { name: /show all \(30\)/i })
    expect(toggleButton).toBeInTheDocument()
  })

  it('expands to show all users and toggles back when clicked', () => {
    const mockData: TagsLeaderboardType = {
      allTime: {
        totalMediaWithTags: 500,
        byUsers: createMockUsers(30)
      }
    }

    render(<TagsLeaderboard tagsLeaderboard={mockData} />)

    const toggleButton = screen.getByRole('button', { name: /show all \(30\)/i })
    fireEvent.click(toggleButton)

    expect(screen.getByText('climber_21')).toBeInTheDocument()
    expect(screen.getByText('climber_30')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show top 20/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /show top 20/i }))
    expect(screen.queryByText('climber_21')).not.toBeInTheDocument()
  })

  it('does not display toggle button when users count is within limit', () => {
    const mockData: TagsLeaderboardType = {
      allTime: {
        totalMediaWithTags: 50,
        byUsers: createMockUsers(10)
      }
    }

    render(<TagsLeaderboard tagsLeaderboard={mockData} />)

    expect(screen.getByText('climber_10')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /show all/i })).not.toBeInTheDocument()
  })
})
