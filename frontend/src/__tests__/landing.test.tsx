import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

import LandingPage from "@/app/page";

describe("LandingPage", () => {
  it("hero metnini render eder", () => {
    render(<LandingPage />);
    expect(screen.getByText(/Hukuki karmaşayı/i)).toBeInTheDocument();
  });
});

