import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApprovalStatusBadge, JobStatusBadge } from "@/components/ui/status-badge";

describe("StatusBadge Komponenten", () => {
  it("rendert Statuslabels für UI-Karten", () => {
    render(
      <div>
        <JobStatusBadge status="analyzed" />
        <ApprovalStatusBadge status="pending_review" />
      </div>,
    );

    expect(screen.getByText("Analysiert")).toBeInTheDocument();
    expect(screen.getByText("Wartet auf Freigabe")).toBeInTheDocument();
  });
});
