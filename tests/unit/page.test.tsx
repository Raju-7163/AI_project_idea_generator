import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page Smoke Test', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    // Check if the main h1 heading is in the document
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(/Turn your skills into the perfect/i);
  });

  it('contains call-to-action buttons', () => {
    render(<Home />);
    
    // Check if the Get Started or Find My Project Idea buttons are present
    const findIdeaLink = screen.getByRole('link', { name: /Find My Project Idea/i });
    expect(findIdeaLink).toBeInTheDocument();
    expect(findIdeaLink).toHaveAttribute('href', '/onboarding');
  });
});
